'use client';

import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
