import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/user/Dashboard';
import KYCForm from './components/user/KYCForm';
import AdminDashboard from './components/admin/AdminDashboard';
import KYCList from './components/admin/KYCList';
import ApprovedList from './components/admin/ApprovedList';
import RejectedList from './components/admin/RejectedList';

// Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="text-white space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Know Your Customer
              <span className="block text-blue-200">Verification System</span>
            </h1>
            <p className="text-lg text-blue-100">
              Streamline your KYC process with our secure, fast, and reliable verification platform. Complete identification verification in minutes.
            </p>
            <div className="flex gap-4 pt-6">
              <a
                href="/login"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-300 shadow-lg"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300 border-2 border-white"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Right Section - Features */}
          <div className="space-y-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white border-opacity-20 hover:bg-opacity-20 transition">
              <div className="flex items-center gap-4">
                <div className="bg-blue-300 rounded-lg p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Verification</h3>
                  <p className="text-blue-100 text-sm">Industry-grade security for your data</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white border-opacity-20 hover:bg-opacity-20 transition">
              <div className="flex items-center gap-4">
                <div className="bg-blue-300 rounded-lg p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Quick Approval</h3>
                  <p className="text-blue-100 text-sm">Fast processing with instant results</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white border-opacity-20 hover:bg-opacity-20 transition">
              <div className="flex items-center gap-4">
                <div className="bg-blue-300 rounded-lg p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Developer Friendly</h3>
                  <p className="text-blue-100 text-sm">Easy integration with modern APIs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-8 mt-20 text-center text-white">
          <div>
            <div className="text-4xl font-bold">10K+</div>
            <p className="text-blue-100">Verified Users</p>
          </div>
          <div>
            <div className="text-4xl font-bold">99.9%</div>
            <p className="text-blue-100">Accuracy Rate</p>
          </div>
          <div>
            <div className="text-4xl font-bold">24/7</div>
            <p className="text-blue-100">Support Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <Navbar />
                  <Dashboard />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/kyc-form"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <Navbar />
                  <KYCForm />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <Navbar />
                  <AdminDashboard />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/kyc/pending"
            element={
              <ProtectedRoute requireAdmin>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <Navbar />
                  <KYCList />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/kyc/approved"
            element={
              <ProtectedRoute requireAdmin>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <Navbar />
                  <ApprovedList />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/kyc/rejected"
            element={
              <ProtectedRoute requireAdmin>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <Navbar />
                  <RejectedList />
                </div>
              </ProtectedRoute>
            }
          />

          {/* 404 route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;