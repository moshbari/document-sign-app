'use client';

import { FolderOpen, Copy } from 'lucide-react';
import Link from 'next/link';

interface TemplateCardProps {
  id: string;
  name: string;
  description?: string;
  fieldCount: number;
}

export default function TemplateCard({
  id,
  name,
  description,
  fieldCount,
}: TemplateCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="p-4 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <FolderOpen className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">{name}</h3>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {description || 'No description provided'}
        </p>

        <div className="text-xs text-gray-500">
          {fieldCount} field{fieldCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 flex gap-2">
        <Link href={`/dashboard/documents/new?templateId=${id}`} className="flex-1">
          <button className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            Use Template
          </button>
        </Link>
        <Link href={`/dashboard/templates/${id}`} className="flex-1">
          <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
            <Copy className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
