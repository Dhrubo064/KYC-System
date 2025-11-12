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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kyc-form"
              element={
                <ProtectedRoute>
                  <KYCForm />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/kyc/pending"
              element={
                <ProtectedRoute requireAdmin>
                  <KYCList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/kyc/approved"
              element={
                <ProtectedRoute requireAdmin>
                  <ApprovedList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/kyc/rejected"
              element={
                <ProtectedRoute requireAdmin>
                  <RejectedList />
                </ProtectedRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;