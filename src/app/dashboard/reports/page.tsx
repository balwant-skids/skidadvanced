'use client';

/**
 * Parent Dashboard - Reports Section
 * View and download child reports
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Child {
  id: string;
  name: string;
}

interface Report {
  id: string;
  title: string;
  description?: string;
  fileType: string;
  fileSize: number;
  reportType: string;
  createdAt: string;
  uploadedBy?: {
    name: string;
    role: string;
  };
}

export default function ReportsPage() {
  const { isLoaded } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) fetchChildren();
  }, [isLoaded]);

  useEffect(() => {
    if (selectedChild) fetchReports();
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const res = await fetch('/api/children');
      if (res.ok) {
        const data = await res.json();
        setChildren(data.children || []);
        if (data.children?.length > 0) {
          setSelectedChild(data.children[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch children:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(`/api/children/${selectedChild}/reports`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  const downloadReport = async (reportId: string, title: string) => {
    try {
      setDownloading(reportId);
      const res = await fetch(`/api/reports/${reportId}/download`);
      if (res.ok) {
        const data = await res.json();
        // Open download URL in new tab
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Failed to download report:', err);
    } finally {
      setDownloading(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    return '📎';
  };

  const reportTypeColors: Record<string, string> = {
    GENERAL: 'bg-gray-100 text-gray-700',
    LAB: 'bg-purple-100 text-purple-700',
    ASSESSMENT: 'bg-blue-100 text-blue-700',
    PRESCRIPTION: 'bg-green-100 text-green-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
          <div className="h-12 bg-gray-200 rounded w-64 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">View and download your child&apos;s reports</p>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500">Add a child to view their reports</p>
          </div>
        ) : (
          <>
            {/* Child Selector */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Child
              </label>
              <select
                value={selectedChild}
                onChange={e => setSelectedChild(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {children.map(child => (
                  <option key={child.id} value={child.id}>{child.name}</option>
                ))}
              </select>
            </div>

            {/* Reports List */}
            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports yet</h3>
                <p className="text-gray-500">Reports uploaded by your clinic will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map(report => (
                  <div
                    key={report.id}
                    className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{getFileIcon(report.fileType)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${reportTypeColors[report.reportType] || reportTypeColors.GENERAL}`}>
                            {report.reportType}
                          </span>
                          <span>{formatFileSize(report.fileSize)}</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        {report.description && (
                          <p className="text-gray-500 text-sm mt-1">{report.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => downloadReport(report.id, report.title)}
                      disabled={downloading === report.id}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {downloading === report.id ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
