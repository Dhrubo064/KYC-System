import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-white bg-opacity-20 rounded-lg p-2 group-hover:bg-opacity-30 transition">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              KYC System
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold">Welcome</p>
                    <p className="text-xs text-blue-100">{user?.fullName}</p>
                  </div>
                </div>

                {/* Dashboard Link */}
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-300 shadow-md"
                >
                  {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                </Link>

                {/* Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="px-4 py-2 bg-blue-500 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                    </svg>
                    <span>Menu</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-50">
                      {!isAdmin && (
                          <Link
                            to="/kyc-form"
                            className="block px-4 py-2 hover:bg-blue-50 transition"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Submit KYC
                          </Link>
                      )}
                      {isAdmin && (
                        <>
                            <Link
                              to="/admin/kyc/pending"
                              className="block px-4 py-2 hover:bg-blue-50 transition"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Pending KYCs
                            </Link>
                            <Link
                              to="/admin/kyc/approved"
                              className="block px-4 py-2 hover:bg-blue-50 transition"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Approved
                            </Link>
                            <Link
                              to="/admin/kyc/rejected"
                              className="block px-4 py-2 hover:bg-blue-50 transition"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Rejected
                            </Link>
                        </>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-semibold"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-300 shadow-md"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-500 border-2 border-white text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300"
                >
                  Get Started
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