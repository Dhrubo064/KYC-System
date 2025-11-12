import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            KYC System
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">Welcome, {user?.fullName}</span>
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;