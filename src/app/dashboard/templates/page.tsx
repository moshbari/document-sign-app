'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import TemplateCard from '@/components/TemplateCard';

interface Template {
  id: string;
  name: string;
  description?: string;
  content: Record<string, unknown>;
  createdAt: Date;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setTemplates(data);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase())
  );

  const getFieldCount = (content: Record<string, unknown>) => {
    if (!content || typeof content !== 'object') return 0;
    if (Array.isArray((content as Record<string, unknown>).fields)) return ((content as Record<string, unknown>).fields as unknown[]).length;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600 mt-1">Reusable document templates</p>
        </div>
        <Link href="/dashboard/templates/new">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            Create Template
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Templates grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No templates found
          </h3>
          <p className="text-gray-600 mb-6">
            {search
              ? 'Try adjusting your search criteria'
              : 'Create your first template to get started'}
          </p>
          {!search && (
            <Link href="/dashboard/templates/new">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Plus className="w-5 h-5" />
                Create Template
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              id={template.id}
              name={template.name}
              description={template.description}
              fieldCount={getFieldCount(template.content)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
