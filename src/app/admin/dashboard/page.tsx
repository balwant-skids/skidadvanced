'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Stats {
  totalClinics: number;
  totalAdmins: number;
  totalParents: number;
  totalChildren: number;
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    // Fetch admin stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Super Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Clinics"
            value={stats?.totalClinics || 0}
            icon="🏥"
            color="blue"
          />
          <StatCard
            title="Total Admins"
            value={stats?.totalAdmins || 0}
            icon="👨‍💼"
            color="purple"
          />
          <StatCard
            title="Total Parents"
            value={stats?.totalParents || 0}
            icon="👨‍👩‍👧‍👦"
            color="green"
          />
          <StatCard
            title="Total Children"
            value={stats?.totalChildren || 0}
            icon="👶"
            color="pink"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton
              title="Add New Clinic"
              description="Create a new clinic and generate code"
              icon="➕"
              onClick={() => router.push('/admin/clinics/new')}
            />
            <ActionButton
              title="Manage Admins"
              description="Add or remove clinic administrators"
              icon="👥"
              onClick={() => router.push('/admin/staff-management')}
            />
            <ActionButton
              title="View Reports"
              description="Generate and view system reports"
              icon="📊"
              onClick={() => router.push('/admin/reports')}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <ActivityItem
              action="New clinic registered"
              details="Mumbai Pediatric Center"
              time="2 hours ago"
            />
            <ActivityItem
              action="Admin added"
              details="mumbai.admin@skids.health"
              time="5 hours ago"
            />
            <ActivityItem
              action="Parent registered"
              details="priya.sharma@example.com"
              time="1 day ago"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    pink: 'bg-pink-50 text-pink-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`text-4xl ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionButton({ title, description, icon, onClick }: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
    >
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </button>
  );
}

function ActivityItem({ action, details, time }: {
  action: string;
  details: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
      <div>
        <p className="font-medium text-gray-900">{action}</p>
        <p className="text-sm text-gray-600">{details}</p>
      </div>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  );
}
