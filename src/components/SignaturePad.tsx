"use client";

import React, { useEffect, useRef, useState } from "react";
import SignaturePadLibrary from "signature_pad";
import { useDropzone } from "react-dropzone";
import {
  PenTool,
  Type,
  Upload,
  Trash2,
  Copy,
  X,
  CheckCircle,
  Lock,
} from "lucide-react";

type SignatureMode = "draw" | "type" | "upload";
type PenColor = "black" | "blue" | "darkblue";
type FontStyle =
  | "dancing-script"
  | "great-vibes"
  | "pacifico"
  | "caveat"
  | "brush";

interface SignaturePadProps {
  onChange: (base64Signature: string) => void;
  onAccept: (base64Signature: string) => void;
}

const fontFamilies: Record<FontStyle, string> = {
  "dancing-script": "cursive",
  "great-vibes": "cursive",
  pacifico: "cursive",
  caveat: "cursive",
  brush: "'Brush Script MT', 'Lucida Calligraphy', cursive",
};

const penColors: Record<PenColor, { hex: string; label: string }> = {
  black: { hex: "#000000", label: "Black" },
  blue: { hex: "#4f46e5", label: "Blue" },
  darkblue: { hex: "#1e3a8a", label: "Dark Blue" },
};

export default function SignaturePad({
  onChange,
  onAccept,
}: SignaturePadProps) {
  const [mode, setMode] = useState<SignatureMode>("draw");
  const [penColor, setPenColor] = useState<PenColor>("black");
  const [penThickness, setPenThickness] = useState(2);
  const [typedName, setTypedName] = useState("");
  const [selectedFont, setSelectedFont] = useState<FontStyle>("dancing-script");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePadLibrary | null>(null);

  // Initialize signature pad
  useEffect(() => {
    if (mode !== "draw" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    const context = canvas.getContext("2d");
    if (context) {
      context.scale(ratio, ratio);
      context.lineCap = "round";
      context.lineJoin = "round";
    }

    if (!signaturePadRef.current) {
      signaturePadRef.current = new SignaturePadLibrary(canvas, {
        penColor: penColors[penColor].hex,
        minWidth: penThickness,
        maxWidth: penThickness + 2,
        throttle: 16,
        minDistance: 5,
      });
    } else {
      signaturePadRef.current.penColor = penColors[penColor].hex;
      signaturePadRef.current.minWidth = penThickness;
      signaturePadRef.current.maxWidth = penThickness + 2;
    }
  }, [mode, penColor, penThickness]);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setPreview(null);
    }
  };

  const getDrawSignature = async (): Promise<string | null> => {
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
      return null;
    }
    return signaturePadRef.current.toDataURL("image/png");
  };

  const getTypeSignature = (): string | null => {
    if (!typedName.trim()) return null;

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 150;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `60px ${fontFamilies[selectedFont]}`;
    ctx.fillStyle = penColors[penColor].hex;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.fillText(typedName, 30, canvas.height / 2);

    return canvas.toDataURL("image/png");
  };

  const handleTypeSignature = () => {
    const sig = getTypeSignature();
    if (sig) {
      setPreview(sig);
      onChange(sig);
    }
  };

  useEffect(() => {
    if (mode === "type" && typedName) {
      handleTypeSignature();
    }
  }, [typedName, selectedFont, penColor, mode]);

  const handleDrawSignature = async () => {
    const sig = await getDrawSignature();
    if (sig) {
      setPreview(sig);
      onChange(sig);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUploadedImage(dataUrl);
        setPreview(dataUrl);
        onChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg"],
    },
  });

  const handleAccept = async () => {
    let signature: string | null = null;

    if (mode === "draw") {
      signature = await getDrawSignature();
    } else if (mode === "type") {
      signature = getTypeSignature();
    } else if (mode === "upload") {
      signature = uploadedImage;
    }

    if (signature) {
      setAccepted(true);
      onAccept(signature);
    }
  };

  if (accepted) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6 text-center">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
          <h3 className="text-lg font-semibold text-green-900">
            Signature Accepted
          </h3>
          <p className="mt-2 text-sm text-green-700">
            Your signature has been saved and will be applied to the document.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Signature Preview:
          </p>
          {preview && (
            <img
              src={preview}
              alt="Signature preview"
              className="max-h-24 w-auto rounded border border-slate-200"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => {
            setMode("draw");
            setPreview(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
            mode === "draw"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <PenTool className="h-4 w-4" />
          Draw
        </button>
        <button
          onClick={() => {
            setMode("type");
            setPreview(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
            mode === "type"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Type className="h-4 w-4" />
          Type
        </button>
        <button
          onClick={() => {
            setMode("upload");
            setPreview(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
            mode === "upload"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </div>

      {/* Draw Mode */}
      {mode === "draw" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Pen Color Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Pen Color
              </label>
              <div className="flex gap-2">
                {Object.entries(penColors).map(([key, { hex, label }]) => (
                  <button
                    key={key}
                    onClick={() => setPenColor(key as PenColor)}
                    className={`flex h-10 w-10 items-center justify-center rounded border-2 transition-colors ${
                      penColor === key
                        ? "border-slate-900 shadow-md"
                        : "border-slate-300"
                    }`}
                    style={{ backgroundColor: hex }}
                    title={label}
                  >
                    {penColor === key && (
                      <div className="h-3 w-3 rounded-full border-2 border-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pen Thickness */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Thickness: {penThickness}px
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={penThickness}
                onChange={(e) => setPenThickness(parseInt(e.target.value))}
                className="h-2 w-32 cursor-pointer rounded-lg bg-slate-200"
              />
            </div>
          </div>

          {/* Canvas */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Sign below
            </label>
            <canvas
              ref={canvasRef}
              className="signature-canvas h-48 w-full rounded border-2 border-slate-300 bg-white shadow-sm"
              onMouseUp={handleDrawSignature}
              onTouchEnd={handleDrawSignature}
            />
          </div>

          <button
            onClick={handleClear}
            className="flex items-center gap-2 rounded bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        </div>
      )}

      {/* Type Mode */}
      {mode === "type" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Your Name
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Enter your full name"
              className="rounded border border-slate-300 px-3 py-2 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              style={{ fontFamily: fontFamilies[selectedFont] }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Font Style
            </label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value as FontStyle)}
              className="rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="dancing-script">Dancing Script</option>
              <option value="great-vibes">Great Vibes</option>
              <option value="pacifico">Pacifico</option>
              <option value="caveat">Caveat</option>
              <option value="brush">Brush Script</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Color
            </label>
            <div className="flex gap-2">
              {Object.entries(penColors).map(([key, { hex, label }]) => (
                <button
                  key={key}
                  onClick={() => setPenColor(key as PenColor)}
                  className={`flex h-10 w-10 items-center justify-center rounded border-2 transition-colors ${
                    penColor === key
                      ? "border-slate-900 shadow-md"
                      : "border-slate-300"
                  }`}
                  style={{ backgroundColor: hex }}
                  title={label}
                >
                  {penColor === key && (
                    <div className="h-3 w-3 rounded-full border-2 border-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {typedName && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Preview:</p>
              <div className="flex items-center justify-center rounded border-2 border-slate-300 bg-slate-50 py-8">
                <div
                  style={{
                    fontFamily: fontFamilies[selectedFont],
                    fontSize: "48px",
                    color: penColors[penColor].hex,
                  }}
                >
                  {typedName}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Mode */}
      {mode === "upload" && (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 bg-slate-50 hover:border-slate-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-3 h-8 w-8 text-slate-400" />
            {isDragActive ? (
              <p className="font-medium text-blue-600">Drop image here...</p>
            ) : (
              <div>
                <p className="font-medium text-slate-900">
                  Drag image here or click to select
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  PNG, JPG, SVG (max 2MB)
                </p>
              </div>
            )}
          </div>

          {uploadedImage && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Preview:</p>
              <div className="flex justify-center rounded border border-slate-200 bg-slate-50 p-4">
                <img
                  src={uploadedImage}
                  alt="Signature preview"
                  className="max-h-40 max-w-full rounded"
                />
              </div>
              <button
                onClick={() => {
                  setUploadedImage(null);
                  setPreview(null);
                }}
                className="flex items-center gap-2 rounded bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {/* Preview Section */}
      {preview && !accepted && (
        <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2 font-medium text-blue-900">
            <Copy className="h-4 w-4" />
            Signature Preview
          </div>
          <div className="flex justify-center rounded bg-white p-3">
            <img
              src={preview}
              alt="Signature preview"
              className="max-h-32 max-w-full"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleAccept}
          disabled={
            !preview ||
            (mode === "draw" && signaturePadRef.current?.isEmpty()) ||
            (mode === "type" && !typedName.trim())
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <CheckCircle className="h-4 w-4" />
          Accept Signature
        </button>
      </div>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-1 text-xs text-slate-600">
        <Lock className="h-3 w-3" />
        Your signature is secure and encrypted
      </div>
    </div>
  );
}
