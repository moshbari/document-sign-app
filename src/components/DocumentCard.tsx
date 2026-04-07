'use client';

import { FileText, Clock, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Link from 'next/link';

interface DocumentCardProps {
  id: string;
  title: string;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'EXPIRED';
  signerCount: number;
  createdAt: Date;
}

export default function DocumentCard({
  id,
  title,
  status,
  signerCount,
  createdAt,
}: DocumentCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link href={`/dashboard/documents/${id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <StatusBadge status={status} />
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{signerCount} signer{signerCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
