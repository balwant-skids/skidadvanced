'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  Baby, 
  CreditCard, 
  TrendingUp,
  RefreshCw,
  Clock
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface AnalyticsData {
  totals: {
    clinics: number;
    parents: number;
    children: number;
    subscriptions: number;
  };
  registrations: {
    date: string;
    count: number;
  }[];
  subscriptionDistribution: {
    planName: string;
    count: number;
    percentage: number;
  }[];
  childrenPerClinic: {
    clinicName: string;
    childCount: number;
  }[];
  timestamp: string;
  cached?: boolean;
  cacheAge?: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/analytics');
      
      if (!res.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const analyticsData = await res.json();
      setData(analyticsData);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header with Refresh Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Real-time insights and metrics</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            {data.cached && (
              <span className="text-xs text-gray-500">(cached {data.cacheAge}s ago)</span>
            )}
          </div>
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              autoRefresh
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Clinics"
          value={data.totals.clinics}
          icon={Building}
          color="blue"
        />
        <MetricCard
          title="Active Parents"
          value={data.totals.parents}
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Total Children"
          value={data.totals.children}
          icon={Baby}
          color="purple"
        />
        <MetricCard
          title="Active Subscriptions"
          value={data.totals.subscriptions}
          icon={CreditCard}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrations Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Parent Registrations (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.registrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Registrations"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subscription Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.subscriptionDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ planName, percentage }) => `${planName}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.subscriptionDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Children Per Clinic Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Children Per Clinic (Top 10)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.childrenPerClinic}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="clinicName" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="childCount" fill="#10b981" name="Children Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );
}
