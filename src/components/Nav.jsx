import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/auth';

export default function Nav() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    nav('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl">TaskManager</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`hover:text-blue-200 transition-colors ${
                    isActive('/dashboard') ? 'text-blue-200 font-medium' : ''
                  }`}
                >
                  Dashboard
                </Link>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm">
                      Welcome, <span className="font-medium">{user.name}</span>
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`hover:text-blue-200 transition-colors px-4 py-2 rounded-lg ${
                    isActive('/login') ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium ${
                    isActive('/register') ? 'bg-gray-100' : ''
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
