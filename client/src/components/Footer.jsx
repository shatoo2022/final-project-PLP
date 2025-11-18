import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="text-xl font-bold text-white">EduMentor</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Empowering students with personalized AI tutoring. 
              Learn at your own pace, master any subject, and achieve your academic goals.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/subjects" className="hover:text-blue-400 transition-colors">Browse Subjects</Link></li>
              <li><Link to="/progress" className="hover:text-blue-400 transition-colors">My Progress</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} EduMentor AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;