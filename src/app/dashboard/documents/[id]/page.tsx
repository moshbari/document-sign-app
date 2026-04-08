'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Mail,
  Download,
  Trash2,
  FileText,
  Clock,
  User,
  Copy,
  Check,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';

interface Signer {
  id: string;
  name: string;
  email: string;
  status: 'PENDING' | 'SIGNED' | 'DECLINED';
  signedAt?: Date;
  token: string;
}

interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: Date;
}

interface DocumentDetail {
  id: string;
  title: string;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'EXPIRED';
  content: any;
  createdAt: Date;
  updatedAt: Date;
  signers: Signer[];
  auditLogs: AuditLog[];
}

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await fetch(`/api/documents/${id}`);
        if (!res.ok) throw new Error('Failed to fetch document');
        const data = await res.json();
        setDocument(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this draft?')) return;

    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      router.push('/dashboard/documents');
    } catch (error) {
      alert('Failed to delete document');
    }
  };

  const handleCopyLink = async (token: string) => {
    const signingUrl = `${window.location.origin}/sign/${token}`;
    try {
      await navigator.clipboard.writeText(signingUrl);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = signingUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    }
  };

  const handleResendInvites = async () => {
    try {
      const res = await fetch(`/api/documents/${id}/resend`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to resend');

      alert('Invitations sent successfully');
    } catch (error) {
      alert('Failed to send invitations');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-12 bg-gray-100 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
          <div className="h-32 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/documents" className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || 'Document not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/documents" className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">{document.title}</h1>
            </div>
            <StatusBadge status={document.status} />
          </div>

          <div className="flex gap-2">
            {document.status !== 'DRAFT' && (
              <button
                onClick={handleResendInvites}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Mail className="w-4 h-4" />
                Resend Invites
              </button>
            )}

            {document.status === 'DRAFT' && (
              <>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Document info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Created</p>
          <p className="font-semibold text-gray-900">
            {new Date(document.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Last Updated</p>
          <p className="font-semibold text-gray-900">
            {new Date(document.updatedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Signers & Signing Links section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Signers & Signing Links</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Share each signer&apos;s unique link via email, WhatsApp, or any messaging app. Each link lets the recipient sign the document securely.
        </p>

        {document.signers.length === 0 ? (
          <p className="text-gray-600">No signers added</p>
        ) : (
          <div className="space-y-4">
            {document.signers.map((signer) => (
              <div
                key={signer.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{signer.name}</p>
                      <p className="text-sm text-gray-600">{signer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={signer.status} />
                    {signer.signedAt && (
                      <div className="text-xs text-gray-500">
                        {new Date(signer.signedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Signing Link */}
                {signer.status === 'PENDING' && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                    <input
                      type="text"
                      readOnly
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/sign/${signer.token}`}
                      className="flex-1 text-sm text-gray-600 bg-transparent border-none outline-none truncate"
                    />
                    <button
                      onClick={() => handleCopyLink(signer.token)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        copiedToken === signer.token
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {copiedToken === signer.token ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                )}
                {signer.status === 'SIGNED' && (
                  <div className="text-sm text-green-600 bg-green-50 rounded-lg p-3 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    This party has signed the document
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shared View Link */}
      {document.status !== 'DRAFT' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <LinkIcon className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Shared View Link</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Share this link with all parties. Anyone with the link can view the agreement status and download a PDF.
          </p>
          <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-3">
            <input
              type="text"
              readOnly
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/view/${document.id}`}
              className="flex-1 text-sm text-purple-700 bg-transparent border-none outline-none truncate"
            />
            <button
              onClick={() => {
                const viewUrl = `${window.location.origin}/view/${document.id}`;
                navigator.clipboard.writeText(viewUrl).then(() => {
                  setCopiedToken('view');
                  setTimeout(() => setCopiedToken(null), 2000);
                }).catch(() => {
                  const textArea = window.document.createElement('textarea');
                  textArea.value = viewUrl;
                  window.document.body.appendChild(textArea);
                  textArea.select();
                  window.document.execCommand('copy');
                  window.document.body.removeChild(textArea);
                  setCopiedToken('view');
                  setTimeout(() => setCopiedToken(null), 2000);
                });
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                copiedToken === 'view'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {copiedToken === 'view' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Document Content section */}
      {document.content && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Document Content</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            {typeof document.content === 'object' && document.content.fields ? (
              <div className="space-y-4">
                {(document.content as any).fields.map((field: any, idx: number) => (
                  <div key={field.id || idx} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-700">{field.label}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full capitalize">{field.type}</span>
                      {field.required && (
                        <span className="text-xs text-red-500">Required</span>
                      )}
                    </div>
                    {field.value && (
                      <p className="text-sm text-gray-600 mt-1">{field.value}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : typeof document.content === 'string' ? (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
                {document.content}
              </div>
            ) : (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(document.content, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Audit log section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>

        {document.auditLogs.length === 0 ? (
          <p className="text-gray-600">No activity yet</p>
        ) : (
          <div className="space-y-4">
            {document.auditLogs.map((log, idx) => (
              <div key={log.id} className="flex gap-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2" />
                  {idx !== document.auditLogs.length - 1 && (
                    <div className="absolute top-5 left-1.5 w-0.5 h-12 bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-gray-900 capitalize">
                    {log.action.replace(/_/g, ' ')}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <time className="text-sm text-gray-600">
                      {new Date(log.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">By {log.performedBy}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
