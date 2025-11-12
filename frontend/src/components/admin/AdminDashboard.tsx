import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { KYCStats } from '../../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<KYCStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getKYCStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm mb-2">Total Submissions</h3>
          <p className="text-3xl font-bold text-gray-800">{stats?.total || 0}</p>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow-md p-6 border border-yellow-200">
          <h3 className="text-yellow-700 text-sm mb-2">Pending Review</h3>
          <p className="text-3xl font-bold text-yellow-700">{stats?.pending || 0}</p>
        </div>

        <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
          <h3 className="text-green-700 text-sm mb-2">Approved</h3>
          <p className="text-3xl font-bold text-green-700">{stats?.approved || 0}</p>
        </div>

        <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
          <h3 className="text-red-700 text-sm mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-700">{stats?.rejected || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/kyc/pending"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending KYCs</h3>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
              {stats?.pending || 0}
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Review and process pending KYC applications
          </p>
          <button className="mt-4 text-blue-600 font-semibold hover:underline">
            View All →
          </button>
        </Link>

        <Link
          to="/admin/kyc/approved"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Approved KYCs</h3>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              {stats?.approved || 0}
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            View all approved KYC applications
          </p>
          <button className="mt-4 text-blue-600 font-semibold hover:underline">
            View All →
          </button>
        </Link>

        <Link
          to="/admin/kyc/rejected"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Rejected KYCs</h3>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
              {stats?.rejected || 0}
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            View all rejected KYC applications
          </p>
          <button className="mt-4 text-blue-600 font-semibold hover:underline">
            View All →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;