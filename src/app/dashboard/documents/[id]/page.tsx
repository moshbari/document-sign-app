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
  Pencil,
  X,
  Plus,
  Save,
} from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import RiskCheckContractView, {
  isRiskCheckContract,
} from '@/components/RiskCheckContractView';

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
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSigners, setEditSigners] = useState<{ name: string; email: string }[]>([]);
  const [saving, setSaving] = useState(false);

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

  const openEditModal = () => {
    if (!document) return;
    setEditTitle(document.title);
    // Handle content - could be JSON with fields or plain text
    if (typeof document.content === 'string') {
      setEditContent(document.content);
    } else if (document.content?.text) {
      setEditContent(document.content.text);
    } else {
      setEditContent(JSON.stringify(document.content, null, 2));
    }
    setEditSigners(
      document.signers
        .filter((s) => s.status !== 'SIGNED')
        .map((s) => ({ name: s.name, email: s.email }))
    );
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!document) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          signers: [
            // Include signed signers as-is
            ...document.signers
              .filter((s) => s.status === 'SIGNED')
              .map((s) => ({ name: s.name, email: s.email })),
            // Include edited unsigned signers
            ...editSigners,
          ],
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
      const updated = await res.json();
      setDocument(updated);
      setEditing(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const addEditSigner = () => {
    setEditSigners([...editSigners, { name: '', email: '' }]);
  };

  const removeEditSigner = (index: number) => {
    setEditSigners(editSigners.filter((_, i) => i !== index));
  };

  const updateEditSigner = (index: number, field: 'name' | 'email', value: string) => {
    const updated = [...editSigners];
    updated[index][field] = value;
    setEditSigners(updated);
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
            {document.status !== 'COMPLETED' &&
              !isRiskCheckContract(document.content) && (
                <button
                  onClick={openEditModal}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              )}
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
            {isRiskCheckContract(document.content) ? (
              <RiskCheckContractView content={document.content} />
            ) : typeof document.content === 'object' && document.content.fields ? (
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

      {/* Edit Modal */}
      {editing && !isRiskCheckContract(document.content) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 mb-10">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-500" />
                Edit Document
              </h2>
              <button
                onClick={() => setEditing(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-y text-sm"
                />
              </div>

              {/* Signers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pending Signers
                </label>
                {/* Show signed signers as read-only */}
                {document.signers.filter((s) => s.status === 'SIGNED').length > 0 && (
                  <div className="mb-3 space-y-2">
                    {document.signers
                      .filter((s) => s.status === 'SIGNED')
                      .map((s) => (
                        <div key={s.id} className="flex items-center gap-2 bg-green-50 rounded-lg p-3 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-800">{s.name}</span>
                          <span className="text-green-600">({s.email})</span>
                          <span className="ml-auto text-xs text-green-500">Signed â cannot edit</span>
                        </div>
                      ))}
                  </div>
                )}

                <div className="space-y-3">
                  {editSigners.map((signer, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={signer.name}
                        onChange={(e) => updateEditSigner(idx, 'name', e.target.value)}
                        placeholder="Full name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                      />
                      <input
                        type="email"
                        value={signer.email}
                        onChange={(e) => updateEditSigner(idx, 'email', e.target.value)}
                        placeholder="email@example.com"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                      />
                      <button
                        onClick={() => removeEditSigner(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addEditSigner}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Signer
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setEditing(false)}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

