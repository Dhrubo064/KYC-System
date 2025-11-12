import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { KYC } from '../../types';
import { formatDateTime } from '../../utils/helpers';

const KYCList: React.FC = () => {
  const [kycs, setKycs] = useState<KYC[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKYC, setSelectedKYC] = useState<KYC | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingKYCs();
  }, []);

  const fetchPendingKYCs = async () => {
    try {
      const response = await adminService.getPendingKYCs();
      setKycs(response.kycs);
    } catch (error) {
      console.error('Failed to fetch pending KYCs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (kycId: string) => {
    if (!window.confirm('Are you sure you want to approve this KYC?')) {
      return;
    }

    setActionLoading(true);
    try {
      await adminService.approveKYC(kycId);
      alert('KYC approved successfully!');
      fetchPendingKYCs();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to approve KYC');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (kyc: KYC) => {
    setSelectedKYC(kyc);
    setShowModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await adminService.rejectKYC(selectedKYC!._id, rejectReason);
      alert('KYC rejected successfully!');
      setShowModal(false);
      setRejectReason('');
      fetchPendingKYCs();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to reject KYC');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pending KYC Applications</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Back to Dashboard
        </button>
      </div>

      {kycs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No pending KYC applications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {kycs.map((kyc) => {
            const user = typeof kyc.userId === 'object' ? kyc.userId : null;
            return (
              <div key={kyc._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{kyc.fullName}</h3>
                    {user && (
                      <>
                        <p className="text-gray-600 text-sm">Email: {user.email}</p>
                        <p className="text-gray-600 text-sm">Phone: {user.phoneNumber}</p>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Submitted</p>
                    <p className="font-semibold">{formatDateTime(kyc.createdAt)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded">
                  <div>
                    <p className="text-gray-600 text-sm">Date of Birth</p>
                    <p className="font-semibold">{new Date(kyc.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">ID Type</p>
                    <p className="font-semibold">{kyc.idType.replace(/_/g, ' ').toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">ID Number</p>
                    <p className="font-semibold">{kyc.idNumber}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="font-semibold">
                      {kyc.address}, {kyc.city}, {kyc.country} - {kyc.postalCode}
                    </p>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded">
                  <p className="text-gray-600 text-sm mb-1">Summary</p>
                  <p className="text-gray-800">{kyc.summary}</p>
                </div>

                {kyc.additionalInfo && (
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">Additional Information</p>
                    <p className="text-gray-800">{kyc.additionalInfo}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(kyc._id)}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-green-300"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectClick(kyc)}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-red-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Reject KYC Application</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this application:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-4">
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-red-300"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectReason('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCList;