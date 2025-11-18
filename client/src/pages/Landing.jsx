import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// --- PARTICLE COMPONENT ---
const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles only after component mounts (client-side)
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,        // 0% to 100% across screen
      size: Math.random() * 15 + 5,     // 5px to 20px size
      duration: Math.random() * 15 + 10,// 10s to 25s float time
      delay: Math.random() * 10,        // 0s to 10s start delay
      opacity: Math.random() * 0.5 + 0.2, // 0.2 to 0.7 opacity (Visible!)
      color: Math.random() > 0.5 ? 'bg-blue-500' : 'bg-cyan-400',
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full blur-md ${p.color} animate-float`}
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            bottom: '-50px', // Start below screen
            // Pass custom CSS variables for the keyframes to use
            '--target-opacity': p.opacity, 
            animationDuration: `${p.duration}s`,
            animationDelay: `-${p.delay}s`, // Negative delay makes them appear immediately scattered
          }}
        />
      ))}
    </div>
  );
};

// --- MAIN LANDING PAGE ---
const Landing = () => {
  return (
    // Added z-10 to content to ensure it sits ON TOP of particles
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* 1. The Particles (Background Layer) */}
      <ParticleBackground />
      
      {/* 2. Static Glow (Middle Layer) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* 3. Main Content (Top Layer) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 z-10">
        <div className="text-center">
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
            Your Personal
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-lg">
              AI Tutor
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience personalized learning with AI-powered tutoring tailored to your pace. 
            Master <span className="text-blue-400 font-semibold">Mathematics</span> and <span className="text-purple-400 font-semibold">English</span> with step-by-step guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all duration-300 font-semibold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:-translate-y-1"
            >
              Get Started Free
            </Link>
            
            <Link 
              to="/login" 
              className="px-8 py-4 bg-transparent text-slate-300 border border-slate-700 rounded-xl hover:border-blue-400 hover:text-white transition-all duration-300 font-semibold text-lg hover:bg-slate-800"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {/* ... (Keep your existing cards exactly the same) ... */}
           <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl group hover:-translate-y-2">
            <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI-Powered Learning</h3>
            <p className="text-slate-400 leading-relaxed">
              Get personalized explanations and step-by-step guidance adapted to your unique learning style.
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl group hover:-translate-y-2">
            <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
              <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Learn at Your Pace</h3>
            <p className="text-slate-400 leading-relaxed">
              Progress through lessons at your own speed with adaptive difficulty adjustments.
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl group hover:-translate-y-2">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Track Your Progress</h3>
            <p className="text-slate-400 leading-relaxed">
              Monitor your improvement with detailed analytics and performance insights.
            </p>
          </div>
        </div>
        
        {/* Subjects Section (Keep existing) */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Available Subjects</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition-all hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="text-3xl text-blue-400 group-hover:text-white">📐</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Mathematics</h3>
                  <p className="text-slate-400 text-sm">Algebra, Geometry, Fractions & more</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500 transition-all hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <span className="text-3xl text-purple-400 group-hover:text-white">📚</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">English</h3>
                  <p className="text-slate-400 text-sm">Grammar, Vocabulary, Reading & Writing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;