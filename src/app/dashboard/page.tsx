'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  FolderOpen,
  Plus,
  ArrowRight,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';

interface Stats {
  totalDocuments: number;
  pendingSignatures: number;
  completed: number;
  templates: number;
}

interface RecentActivity {
  id: string;
  title: string;
  action: string;
  timestamp: Date;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      try {
        const [docsRes, templatesRes] = await Promise.all([
          fetch('/api/documents'),
          fetch('/api/templates'),
        ]);

        if (!docsRes.ok || !templatesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const docs: any[] = await docsRes.json();
        const templates: any[] = await templatesRes.json();

        const totalDocuments = docs.length;
        const pendingSignatures = docs.filter(
          (doc: Record<string, unknown>) =>
            (doc.signers as any[])?.some((s: any) => s.status === 'PENDING')
        ).length;
        const completed = docs.filter(
          (doc: Record<string, unknown>) => doc.status === 'COMPLETED'
        ).length;

        setStats({
          totalDocuments,
          pendingSignatures,
          completed,
          templates: templates.length,
        });

        // Get recent activity (first 5 documents)
        setActivity(
          docs.slice(0, 5).map((doc: Record<string, unknown>) => ({
            id: doc.id as string,
            title: doc.title as string,
            action: `${(doc.status as string).toLowerCase()}`,
            timestamp: new Date(doc.createdAt as string),
            status: doc.status as 'DRAFT' | 'PENDING' | 'COMPLETED',
          }))
        );
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: number;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, User!
        </h2>
        <p className="text-gray-600">
          Manage your documents and templates efficiently
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap">
        <Link href="/dashboard/documents/new">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            New Document
          </button>
        </Link>
        <Link href="/dashboard/templates/new">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            Create Template
          </button>
        </Link>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={FileText} label="Total Documents" value={stats?.totalDocuments || 0} />
          <StatCard icon={Clock} label="Pending Signatures" value={stats?.pendingSignatures || 0} />
          <StatCard icon={CheckCircle} label="Completed" value={stats?.completed || 0} />
          <StatCard icon={FolderOpen} label="Templates" value={stats?.templates || 0} />
        </div>
      )}

      {/* Recent activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
        </div>

        {activity.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No activity yet. Create your first document to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activity.map((item) => (
              <Link key={item.id} href={`/dashboard/documents/${item.id}`}>
                <div className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer group">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">
                        {item.timestamp.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
