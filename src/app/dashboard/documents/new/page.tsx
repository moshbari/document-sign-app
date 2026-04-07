'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  description?: string;
  content: Record<string, unknown>;
}

interface Signer {
  name: string;
  email: string;
}

type Step = 1 | 2 | 3 | 4;

export default function NewDocumentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
      <NewDocumentContent />
    </Suspense>
  );
}

function NewDocumentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');

  const [step, setStep] = useState<Step>(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [signers, setSigners] = useState<Signer[]>([
    { name: '', email: '' },
  ]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setTemplates(data);

        if (templateId) {
          const template = data.find((t: Template) => t.id === templateId);
          if (template) {
            setSelectedTemplate(template);
            setStep(2);
          }
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [templateId]);

  const handleAddSigner = () => {
    setSigners([...signers, { name: '', email: '' }]);
  };

  const handleRemoveSigner = (index: number) => {
    setSigners(signers.filter((_, i) => i !== index));
  };

  const handleSignerChange = (
    index: number,
    field: 'name' | 'email',
    value: string
  ) => {
    const newSigners = [...signers];
    newSigners[index][field] = value;
    setSigners(newSigners);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Please enter a document title');
      return;
    }

    if (signers.some((s) => !s.name.trim() || !s.email.trim())) {
      alert('Please fill in all signer information');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          templateId: selectedTemplate?.id,
          signers,
          content: content || selectedTemplate?.content,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create document');
      }

      const data = await res.json();
      router.push(`/dashboard/documents/${data.id}`);
    } catch (error) {
      console.error('Failed to create document:', error);
      alert(error instanceof Error ? error.message : 'Failed to create document');
    } finally {
      setSubmitting(false);
    }
  };

  const progressSteps = ['Template', 'Details', 'Signers', 'Review'];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/documents" className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Document</h1>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {progressSteps.map((label, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  idx + 1 === step
                    ? 'bg-blue-600 text-white'
                    : idx + 1 < step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {idx + 1 < step ? (
                  <Check className="w-4 h-4" />
                ) : (
                  idx + 1
                )}
              </div>
              {idx < progressSteps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    idx + 1 < step ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              )}
              {idx === progressSteps.length - 1 && (
                <span className="text-sm font-medium text-gray-600 ml-2">
                  {label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {/* Step 1: Choose template */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Choose a Template
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => {
                      setSelectedTemplate(null);
                      setStep(2);
                    }}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Start from Scratch
                    </h3>
                    <p className="text-sm text-gray-600">
                      Create a blank document
                    </p>
                  </button>

                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setStep(2);
                      }}
                      className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {template.description ||
                          'No description provided'}
                      </p>
                    </button>
                  ))}
                </div>

                {templates.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No templates available</p>
                    <Link href="/dashboard/templates/new">
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Create a template first
                      </button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 2: Fill details */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Document Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Service Agreement"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {selectedTemplate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Preview
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 max-h-48 overflow-y-auto">
                    {selectedTemplate.description}
                  </div>
                </div>
              )}

              {!selectedTemplate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter document content..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Add signers */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Add Signers
            </h2>

            <div className="space-y-4">
              {signers.map((signer, idx) => (
                <div key={idx} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Signer Name
                    </label>
                    <input
                      type="text"
                      value={signer.name}
                      onChange={(e) =>
                        handleSignerChange(idx, 'name', e.target.value)
                      }
                      placeholder="Full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={signer.email}
                      onChange={(e) =>
                        handleSignerChange(idx, 'email', e.target.value)
                      }
                      placeholder="email@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  {signers.length > 1 && (
                    <button
                      onClick={() => handleRemoveSigner(idx)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddSigner}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                type="button"
              >
                <Plus className="w-4 h-4" />
                Add Signer
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Review & Send
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Title</h3>
                <p className="text-gray-600">{title}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Signers</h3>
                <div className="space-y-2">
                  {signers.map((signer, idx) => (
                    <div key={idx} className="flex justify-between text-gray-600">
                      <span>{signer.name}</span>
                      <span>{signer.email}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTemplate && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Template
                  </h3>
                  <p className="text-gray-600">{selectedTemplate.name}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setStep((prev) => (prev > 1 ? (prev - 1 as Step) : prev))}
          disabled={step === 1}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex gap-3">
          {step === 4 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {submitting ? 'Creating...' : 'Create Document'}
            </button>
          ) : (
            <button
              onClick={() => setStep((prev) => (prev < 4 ? (prev + 1 as Step) : prev))}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
