'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  User, 
  Calendar,
  CheckSquare,
  Square,
  Trash2,
  UserCheck
} from 'lucide-react';

interface PendingParent {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
}

interface BulkError {
  id: string;
  name: string;
  reason: string;
}

export default function WhitelistPage() {
  const [pendingParents, setPendingParents] = useState<PendingParent[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({});
  
  // Bulk operations state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
  const [bulkPlanId, setBulkPlanId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending parents
      const parentsRes = await fetch('/api/admin/whitelist/pending');
      if (parentsRes.ok) {
        const data = await parentsRes.json();
        setPendingParents(data.parents || []);
      }

      // Fetch available plans
      const plansRes = await fetch('/api/care-plans');
      if (plansRes.ok) {
        const data = await plansRes.json();
        setPlans(data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Selection handlers
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === pendingParents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingParents.map(p => p.id)));
    }
  };

  // Single operations
  const handleApprove = async (parentId: string) => {
    const planId = selectedPlans[parentId];
    
    if (!planId) {
      alert('Please select a plan before approving');
      return;
    }

    setProcessingId(parentId);
    
    try {
      const res = await fetch('/api/admin/whitelist/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId, planId }),
      });

      if (res.ok) {
        setPendingParents(prev => prev.filter(p => p.id !== parentId));
        alert('Parent approved successfully!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || 'Failed to approve parent'}`);
      }
    } catch (error) {
      console.error('Error approving parent:', error);
      alert('Failed to approve parent');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (parentId: string) => {
    if (!confirm('Are you sure you want to reject this parent account?')) {
      return;
    }

    setProcessingId(parentId);
    
    try {
      const res = await fetch('/api/admin/whitelist/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId }),
      });

      if (res.ok) {
        setPendingParents(prev => prev.filter(p => p.id !== parentId));
        alert('Parent rejected');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || 'Failed to reject parent'}`);
      }
    } catch (error) {
      console.error('Error rejecting parent:', error);
      alert('Failed to reject parent');
    } finally {
      setProcessingId(null);
    }
  };

  // Bulk operations
  const handleBulkApprove = async () => {
    if (!bulkPlanId) {
      alert('Please select a plan for bulk approval');
      return;
    }

    setBulkProcessing(true);
    setBulkProgress(0);

    try {
      const parentIds = Array.from(selectedIds);
      const res = await fetch('/api/admin/whitelist/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentIds, planId: bulkPlanId }),
      });

      const result = await res.json();

      if (res.ok) {
        // Remove successfully approved parents
        setPendingParents(prev => 
          prev.filter(p => !parentIds.includes(p.id) || 
            result.errors.some((e: BulkError) => e.id === p.id))
        );
        
        setSelectedIds(new Set());
        setShowBulkApproveModal(false);
        setBulkPlanId('');

        // Show summary
        if (result.failed > 0) {
          alert(`Bulk approval complete!\n\nSuccess: ${result.success}\nFailed: ${result.failed}\n\nErrors:\n${result.errors.map((e: BulkError) => `- ${e.name}: ${e.reason}`).join('\n')}`);
        } else {
          alert(`Successfully approved ${result.success} parents!`);
        }
      } else {
        alert(`Error: ${result.error || 'Failed to process bulk approval'}`);
      }
    } catch (error) {
      console.error('Bulk approve error:', error);
      alert('Failed to process bulk approval');
    } finally {
      setBulkProcessing(false);
      setBulkProgress(0);
    }
  };

  const handleBulkReject = async () => {
    setBulkProcessing(true);
    setBulkProgress(0);

    try {
      const parentIds = Array.from(selectedIds);
      const res = await fetch('/api/admin/whitelist/bulk-reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentIds }),
      });

      const result = await res.json();

      if (res.ok) {
        // Remove successfully rejected parents
        setPendingParents(prev => 
          prev.filter(p => !parentIds.includes(p.id) || 
            result.errors.some((e: BulkError) => e.id === p.id))
        );
        
        setSelectedIds(new Set());
        setShowBulkRejectModal(false);

        // Show summary
        if (result.failed > 0) {
          alert(`Bulk rejection complete!\n\nSuccess: ${result.success}\nFailed: ${result.failed}\n\nErrors:\n${result.errors.map((e: BulkError) => `- ${e.name}: ${e.reason}`).join('\n')}`);
        } else {
          alert(`Successfully rejected ${result.success} parents!`);
        }
      } else {
        alert(`Error: ${result.error || 'Failed to process bulk rejection'}`);
      }
    } catch (error) {
      console.error('Bulk reject error:', error);
      alert('Failed to process bulk rejection');
    } finally {
      setBulkProcessing(false);
      setBulkProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parent Whitelist</h1>
              <p className="mt-1 text-sm text-gray-600">
                Approve or reject parent registrations
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {pendingParents.length} Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pendingParents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-600">
              No pending parent approvals at the moment.
            </p>
          </div>
        ) : (
          <>
            {/* Select All Checkbox */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <label className="flex items-center cursor-pointer">
                <button
                  onClick={toggleSelectAll}
                  className="mr-3"
                >
                  {selectedIds.size === pendingParents.length ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {selectedIds.size === pendingParents.length 
                    ? 'Deselect All' 
                    : 'Select All'
                  } ({selectedIds.size} selected)
                </span>
              </label>
            </div>

            <div className="space-y-4">
              {pendingParents.map((parent, index) => (
                <motion.div
                  key={parent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all ${
                    selectedIds.has(parent.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(parent.id)}
                      className="mr-4 mt-1"
                    >
                      {selectedIds.has(parent.id) ? (
                        <CheckSquare className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Square className="w-6 h-6 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {parent.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-1" />
                            {parent.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        Registered: {new Date(parent.createdAt).toLocaleDateString()}
                      </div>

                      {/* Plan Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assign Subscription Plan
                        </label>
                        <select
                          value={selectedPlans[parent.id] || ''}
                          onChange={(e) => setSelectedPlans(prev => ({
                            ...prev,
                            [parent.id]: e.target.value
                          }))}
                          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={processingId === parent.id}
                        >
                          <option value="">Select a plan...</option>
                          {plans.map(plan => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name} - ₹{plan.price}/month
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleApprove(parent.id)}
                        disabled={processingId === parent.id || !selectedPlans[parent.id]}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(parent.id)}
                        disabled={processingId === parent.id}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {processingId === parent.id && (
                    <div className="mt-4 flex items-center text-sm text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Processing...
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-2xl border-2 border-blue-500 p-6 z-50"
          >
            <div className="flex items-center space-x-6">
              <div className="text-sm font-medium text-gray-700">
                {selectedIds.size} parent{selectedIds.size > 1 ? 's' : ''} selected
              </div>
              
              <button
                onClick={() => setShowBulkApproveModal(true)}
                disabled={bulkProcessing}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300"
              >
                <UserCheck className="w-5 h-5" />
                <span>Bulk Approve</span>
              </button>
              
              <button
                onClick={() => setShowBulkRejectModal(true)}
                disabled={bulkProcessing}
                className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300"
              >
                <Trash2 className="w-5 h-5" />
                <span>Bulk Reject</span>
              </button>
              
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-gray-600 hover:text-gray-900"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Approve Modal */}
      {showBulkApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Bulk Approve Parents
            </h2>
            
            <p className="text-gray-600 mb-4">
              You are about to approve <strong>{selectedIds.size}</strong> parent{selectedIds.size > 1 ? 's' : ''}. 
              Please select a plan to assign to all selected parents.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Plan for All
              </label>
              <select
                value={bulkPlanId}
                onChange={(e) => setBulkPlanId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={bulkProcessing}
              >
                <option value="">Select a plan...</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ₹{plan.price}/month
                  </option>
                ))}
              </select>
            </div>

            {bulkProcessing && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Processing...</span>
                  <span>{bulkProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${bulkProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowBulkApproveModal(false)}
                disabled={bulkProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkApprove}
                disabled={bulkProcessing || !bulkPlanId}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
              >
                {bulkProcessing ? 'Processing...' : 'Approve All'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bulk Reject Modal */}
      {showBulkRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Bulk Reject Parents
            </h2>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to reject <strong>{selectedIds.size}</strong> parent{selectedIds.size > 1 ? 's' : ''}? 
              This action will delete their accounts and cannot be undone.
            </p>

            {bulkProcessing && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Processing...</span>
                  <span>{bulkProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all"
                    style={{ width: `${bulkProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowBulkRejectModal(false)}
                disabled={bulkProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkReject}
                disabled={bulkProcessing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300"
              >
                {bulkProcessing ? 'Processing...' : 'Reject All'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
