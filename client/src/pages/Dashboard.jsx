import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    // 1. BACKGROUND: Deep Slate with a subtle top glow
    <div className="min-h-screen bg-slate-950 py-8 relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{user?.name}</span>! 👋
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Ready to continue your learning journey today?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Stat Card 1: Grade */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Grade Level</p>
                <p className="text-3xl font-bold text-white mt-1">Grade {user?.gradeLevel}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
          </div>

          {/* Stat Card 2: Lessons */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Lessons Completed</p>
                <p className="text-3xl font-bold text-white mt-1">0</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          {/* Stat Card 3: Score */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Average Score</p>
                <p className="text-3xl font-bold text-white mt-1">--</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-blue-500 rounded-full block"></span>
            Your Subjects
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Active Subject: Math */}
            <Link 
              to="/subjects/Mathematics" 
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500 transition-all duration-300 cursor-pointer group hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <span className="text-3xl group-hover:text-white transition-colors">📐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Mathematics</h3>
                    <p className="text-slate-400 text-sm mt-1 group-hover:text-slate-300">Start learning algebra, geometry, and more</p>
                  </div>
                </div>
                <svg className="w-6 h-6 text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Disabled Subject: English */}
            <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-2xl opacity-60 cursor-not-allowed grayscale relative overflow-hidden">
               {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-slate-800 text-xs font-bold text-slate-400 rounded-full border border-slate-700">
                COMING SOON
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl opacity-50">📚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-300">English</h3>
                    <p className="text-slate-500 text-sm mt-1">Grammar, vocabulary, reading</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Banner */}
        <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                🚀 Getting Started
              </h3>
              <p className="text-slate-300 max-w-xl">
                Click on the <strong>Mathematics</strong> card above to explore topics and start your first lesson with your personalized AI tutor!
              </p>
            </div>
            
            <Link 
              to="/subjects/Mathematics" 
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] whitespace-nowrap"
            >
              Start Learning Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;