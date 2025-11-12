import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { KYC } from '../../types';
import { formatDateTime } from '../../utils/helpers';

const RejectedList: React.FC = () => {
  const [kycs, setKycs] = useState<KYC[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRejectedKYCs();
  }, []);

  const fetchRejectedKYCs = async () => {
    try {
      const response = await adminService.getRejectedKYCs();
      setKycs(response.kycs);
    } catch (error) {
      console.error('Failed to fetch rejected KYCs:', error);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rejected KYC Applications</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Back to Dashboard
        </button>
      </div>

      {kycs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No rejected KYC applications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {kycs.map((kyc) => {
            const user = typeof kyc.userId === 'object' ? kyc.userId : null;
            return (
              <div key={kyc._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{kyc.fullName}</h3>
                    {user && (
                      <>
                        <p className="text-gray-600 text-sm">Email: {user.email}</p>
                        <p className="text-gray-600 text-sm">Phone: {user.phoneNumber}</p>
                      </>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    Rejected
                  </span>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Submitted At</p>
                    <p className="font-semibold">{formatDateTime(kyc.createdAt)}</p>
                  </div>
                  {kyc.reviewedAt && (
                    <div>
                      <p className="text-gray-600 text-sm">Rejected At</p>
                      <p className="font-semibold">{formatDateTime(kyc.reviewedAt)}</p>
                    </div>
                  )}
                </div>

                {kyc.rejectionReason && (
                  <div className="p-4 bg-red-50 rounded border border-red-200 mb-4">
                    <p className="text-gray-700 font-semibold mb-1">Rejection Reason:</p>
                    <p className="text-red-700">{kyc.rejectionReason}</p>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded">
                  <p className="text-gray-600 text-sm mb-1">Summary</p>
                  <p className="text-gray-800">{kyc.summary}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RejectedList;