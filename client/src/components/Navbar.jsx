import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => 
    `text-sm font-medium transition-colors duration-200 ${
      isActive(path) 
        ? 'text-blue-400' 
        : 'text-slate-300 hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Area */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors">
              EduMentor
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Authenticated Links */}
                <div className="hidden md:flex items-center space-x-6">
                  <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
                  <Link to="/subjects" className={linkClass('/subjects')}>Subjects</Link>
                </div>
                
                <div className="h-8 w-px bg-slate-800 mx-2 hidden md:block"></div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-bold text-white leading-none mb-1">{user?.name}</p>
                    <p className="text-xs text-blue-400 font-medium uppercase tracking-wide">Grade {user?.gradeLevel}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 1. NEW: Home Icon (Visible to everyone not logged in) */}
                <Link 
                  to="/" 
                  className="text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-all"
                  title="Back to Home"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>

                <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up
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