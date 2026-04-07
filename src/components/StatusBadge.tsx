'use client';

interface StatusBadgeProps {
  status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'SIGNED' | 'DECLINED';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    DRAFT: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
    EXPIRED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expired' },
    SIGNED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Signed' },
    DECLINED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Declined' },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
