'use client';

/**
 * Admin Parent Management Page
 * Manage whitelist and view parent subscriptions
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Download } from 'lucide-react';
import { exportToCSV, generateTimestampedFilename } from '@/lib/csv-export';
import { SearchBar } from '@/components/admin/SearchBar';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { EmptyState } from '@/components/admin/EmptyState';

interface WhitelistEntry {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  isRegistered: boolean;
  createdAt: string;
}

interface Clinic {
  id: string;
  name: string;
  code: string;
}

export default function ParentsPage() {
  const { isLoaded } = useAuth();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<string>('');
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [filteredWhitelist, setFilteredWhitelist] = useState<WhitelistEntry[]>([]);

  useEffect(() => {
    if (isLoaded) {
      fetchClinics();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (selectedClinic) {
      fetchWhitelist();
    }
  }, [selectedClinic]);

  const fetchClinics = async () => {
    try {
      const res = await fetch('/api/clinics');
      if (res.ok) {
        const data = await res.json();
        setClinics(data.clinics || []);
        if (data.clinics?.length > 0) {
          setSelectedClinic(data.clinics[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch clinics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWhitelist = async () => {
    try {
      const res = await fetch(`/api/clinics/${selectedClinic}/whitelist`);
      if (res.ok) {
        const data = await res.json();
        setWhitelist(data.whitelist || []);
      }
    } catch (err) {
      console.error('Failed to fetch whitelist:', err);
    }
  };

  // Filter whitelist based on search and filters
  useEffect(() => {
    let filtered = [...whitelist];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.email.toLowerCase().includes(query) ||
        entry.name?.toLowerCase().includes(query) ||
        entry.phone?.includes(query)
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(entry => {
        if (statusFilter.includes('registered')) {
          return entry.isRegistered;
        }
        if (statusFilter.includes('pending')) {
          return !entry.isRegistered;
        }
        return true;
      });
    }

    setFilteredWhitelist(filtered);
  }, [whitelist, searchQuery, statusFilter]);

  const removeFromWhitelist = async (email: string) => {
    if (!confirm('Remove this email from the whitelist?')) return;
    
    try {
      const res = await fetch(
        `/api/clinics/${selectedClinic}/whitelist/${encodeURIComponent(email)}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        fetchWhitelist();
      }
    } catch (err) {
      console.error('Failed to remove from whitelist:', err);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setExportProgress(0);

      // Fetch export data
      const res = await fetch('/api/admin/export/parents');
      if (!res.ok) throw new Error('Failed to fetch export data');
      
      const { data } = await res.json();
      setExportProgress(50);

      // Define CSV headers
      const headers = [
        'id', 'name', 'email', 'phone', 'isActive', 'clinicName', 'clinicCode',
        'subscriptionStatus', 'planName', 'planPrice', 'childrenCount', 'createdAt'
      ];

      // Generate and download CSV
      await exportToCSV({
        filename: generateTimestampedFilename('parents_export'),
        headers,
        data,
        onProgress: (progress) => setExportProgress(50 + progress / 2),
      });

      setExportProgress(100);
      setTimeout(() => {
        setExporting(false);
        setExportProgress(0);
      }, 1000);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export parents data');
      setExporting(false);
      setExportProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parent Management</h1>
            <p className="text-gray-600 mt-1">Manage parent whitelist and subscriptions</p>
          </div>
        </div>

        {/* Clinic Selector */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Clinic
          </label>
          <select
            value={selectedClinic}
            onChange={e => setSelectedClinic(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {clinics.map(clinic => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name} ({clinic.code})
              </option>
            ))}
          </select>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <SearchBar
                placeholder="Search by email, name, or phone..."
                onSearch={setSearchQuery}
                initialValue={searchQuery}
              />
            </div>
            <div className="flex gap-3">
              <FilterDropdown
                label="Status"
                options={[
                  { value: 'registered', label: 'Registered' },
                  { value: 'pending', label: 'Pending' },
                ]}
                selectedValues={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
          </div>
          
          {/* Result Count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredWhitelist.length} of {whitelist.length} parents
            {(searchQuery || statusFilter.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter([]);
                }}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Whitelist Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Parent Whitelist</h2>
              <p className="text-sm text-gray-500 mt-1">
                Only whitelisted emails can register for this clinic
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:bg-gray-300"
              >
                <Download className="w-5 h-5" />
                {exporting ? `Exporting... ${exportProgress}%` : 'Export CSV'}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              Add to Whitelist
            </button>
          </div>

          {filteredWhitelist.length === 0 && whitelist.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No parents whitelisted</h3>
              <p className="text-gray-500">Add parent emails to allow them to register</p>
            </div>
          ) : filteredWhitelist.length === 0 ? (
            <EmptyState
              title="No parents found"
              message="No parents match your search criteria. Try adjusting your filters."
              hasFilters={true}
              onClearFilters={() => {
                setSearchQuery('');
                setStatusFilter([]);
              }}
              icon="search"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredWhitelist.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{entry.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{entry.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{entry.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          entry.isRegistered 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {entry.isRegistered ? 'Registered' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => removeFromWhitelist(entry.email)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add to Whitelist Modal */}
        {showAddModal && (
          <AddToWhitelistModal
            clinicId={selectedClinic}
            onClose={() => setShowAddModal(false)}
            onAdded={() => {
              setShowAddModal(false);
              fetchWhitelist();
            }}
          />
        )}
      </div>
    </div>
  );
}

// Add to Whitelist Modal
function AddToWhitelistModal({ clinicId, onClose, onAdded }: {
  clinicId: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [formData, setFormData] = useState({ email: '', name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/clinics/${clinicId}/whitelist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add to whitelist');
      }

      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Add to Whitelist</h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="parent@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Parent name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="+91..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add to Whitelist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
