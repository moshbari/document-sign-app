'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import DocumentCard from '@/components/DocumentCard';

interface Signer {
  id: string;
  status: string;
}

interface Document {
  id: string;
  title: string;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'EXPIRED';
  createdAt: Date;
  signers: Signer[];
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'PENDING' | 'COMPLETED'>(
    'ALL'
  );
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch('/api/documents');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setDocuments(data);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents
    .filter((doc) => filter === 'ALL' || doc.status === filter)
    .filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase())
    );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Manage all your signing documents</p>
        </div>
        <Link href="/dashboard/documents/new">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            New Document
          </button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(
              [
                { label: 'All', value: 'ALL' },
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Pending', value: 'PENDING' },
                { label: 'Completed', value: 'COMPLETED' },
              ] as const
            ).map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === btn.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents display */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No documents found
          </h3>
          <p className="text-gray-600 mb-6">
            {search
              ? 'Try adjusting your search criteria'
              : 'Create your first document to get started'}
          </p>
          {!search && (
            <Link href="/dashboard/documents/new">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Plus className="w-5 h-5" />
                Create Document
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="relative">
              <DocumentCard
                id={doc.id}
                title={doc.title}
                status={doc.status}
                signerCount={doc.signers?.length || 0}
                createdAt={doc.createdAt}
              />
              {doc.status === 'DRAFT' && (
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="absolute top-2 right-2 p-2 hover:bg-red-50 rounded-md text-red-600 opacity-0 hover:opacity-100 transition-opacity"
                  title="Delete draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
