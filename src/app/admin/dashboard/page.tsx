'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, FileText, Send, Home, BookOpen } from 'lucide-react';

interface Stats {
  totalParents: number;
  whitelistedParents: number;
  totalPlans: number;
  totalCampaigns: number;
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalParents: 0,
    whitelistedParents: 0,
    totalPlans: 0,
    totalCampaigns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalParents: 0,
        whitelistedParents: 0,
        totalPlans: 0,
        totalCampaigns: 0
      });
      setLoading(false);
    }, 500);
  }, [user]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Simple Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SKIDS Advanced
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center space-x-1">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link href="/discovery" className="text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>Educational Content</span>
              </Link>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Super Admin
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white shadow-sm mt-8 mx-4 sm:mx-6 lg:mx-8 rounded-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Parents"
            value={stats.totalParents}
            icon="👨‍👩‍👧‍👦"
            color="blue"
          />
          <StatCard
            title="Whitelisted Parents"
            value={stats.whitelistedParents}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Care Plans"
            value={stats.totalPlans}
            icon="📋"
            color="purple"
          />
          <StatCard
            title="Campaigns"
            value={stats.totalCampaigns}
            icon="📢"
            color="orange"
          />
        </div>

        {/* Core Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Core Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
              title="Whitelist Parents"
              description="Add parent emails to grant access to educational content and care plans"
              icon={<Users className="w-8 h-8 text-blue-600" />}
              href="/admin/parents"
              color="blue"
            />
            <ActionCard
              title="Manage Care Plans"
              description="Create, edit, and manage care plans for parents"
              icon={<FileText className="w-8 h-8 text-purple-600" />}
              href="/admin/care-plans"
              color="purple"
            />
            <ActionCard
              title="Manage Campaigns"
              description="Create and send campaigns to parents"
              icon={<Send className="w-8 h-8 text-green-600" />}
              href="/admin/campaigns"
              color="green"
            />
            <ActionCard
              title="View Educational Content"
              description="Browse and manage educational videos and modules"
              icon={<BookOpen className="w-8 h-8 text-orange-600" />}
              href="/discovery"
              color="orange"
            />
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">1. Whitelist Parents</h4>
              <p className="text-white/90 text-sm">Add parent email addresses to grant them access to the platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Create Care Plans</h4>
              <p className="text-white/90 text-sm">Design care plans with pricing and features for parents to subscribe</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Send Campaigns</h4>
              <p className="text-white/90 text-sm">Create newsletters and updates to keep parents informed</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Parents Access Content</h4>
              <p className="text-white/90 text-sm">Whitelisted parents can view educational videos and care plans</p>
            </div>
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
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 ${colorClasses[color as keyof typeof colorClasses]} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, icon, href, color }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50',
    purple: 'border-purple-200 hover:border-purple-500 hover:bg-purple-50',
    green: 'border-green-200 hover:border-green-500 hover:bg-green-50',
    orange: 'border-orange-200 hover:border-orange-500 hover:bg-orange-50',
  };

  return (
    <Link
      href={href}
      className={`flex items-start p-6 border-2 ${colorClasses[color as keyof typeof colorClasses]} rounded-xl transition-all group`}
    >
      <div className="mr-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
