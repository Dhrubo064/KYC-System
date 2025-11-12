import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { kycService } from '../../services/kycService';
import { KYC } from '../../types';
import { formatDateTime, getStatusColor, getStatusBadge } from '../../utils/helpers';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kyc, setKyc] = useState<KYC | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasKyc, setHasKyc] = useState(false);

  useEffect(() => {
    fetchKYCData();
  }, []);

  const fetchKYCData = async () => {
    try {
      const response = await kycService.getMyKYC();
      setKyc(response.kyc);
      setHasKyc(true);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setHasKyc(false);
      }
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.fullName}!</h2>
        <p className="text-gray-600">Email: {user?.email}</p>
        <p className="text-gray-600">Phone: {user?.phoneNumber}</p>
      </div>

      {!hasKyc ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">KYC Verification Required</h3>
          <p className="text-gray-700 mb-4">
            Please complete your KYC verification to access all features.
          </p>
          <button
            onClick={() => navigate('/kyc-form')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start KYC Verification
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">KYC Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(kyc!.status)}`}>
              {getStatusBadge(kyc!.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Submitted At</p>
              <p className="font-semibold">{formatDateTime(kyc!.createdAt)}</p>
            </div>

            {kyc!.reviewedAt && (
              <div>
                <p className="text-gray-600 text-sm">Reviewed At</p>
                <p className="font-semibold">{formatDateTime(kyc!.reviewedAt)}</p>
              </div>
            )}

            {kyc!.status === 'rejected' && kyc!.rejectionReason && (
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Rejection Reason</p>
                <p className="text-red-600 font-semibold">{kyc!.rejectionReason}</p>
              </div>
            )}
          </div>

          {kyc!.status === 'rejected' && (
            <div className="mt-4">
              <button
                onClick={() => navigate('/kyc-form')}
                className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
              >
                Resubmit KYC
              </button>
            </div>
          )}

          {kyc!.status === 'approved' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 font-semibold">
                ✓ Your KYC has been approved! You have full access to all features.
              </p>
            </div>
          )}

          {kyc!.status === 'pending' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                Your KYC is being reviewed by our team. We'll notify you once it's processed.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;