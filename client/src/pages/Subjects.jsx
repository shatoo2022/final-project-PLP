import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Subjects = () => {
  const { subject } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentSubject = subject || 'Mathematics';

  useEffect(() => {
    fetchTopics();
  }, [currentSubject]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lessonAPI.getTopics(currentSubject);
      setTopics(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load topics');
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading topics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl">
            <p className="text-red-400 font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {error}
            </p>
            <Link to="/dashboard" className="mt-4 inline-block text-red-300 hover:text-white underline">Return to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    // 1. BACKGROUND: Deep Slate with overflow hidden for the glow blob
    <div className="min-h-screen bg-slate-950 py-8 relative overflow-hidden text-slate-200">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 font-medium mb-4 inline-flex items-center transition-colors group">
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white flex items-center gap-4 mt-2">
            <span className="flex items-center justify-center w-12 h-12 bg-slate-800 rounded-xl border border-slate-700 text-3xl shadow-lg">
              {currentSubject === 'Mathematics' ? '📐' : '📚'}
            </span>
            <span>{currentSubject}</span>
          </h1>
          <p className="text-slate-400 mt-3 text-lg">
            Choose a topic below to start your personalized session with the AI tutor.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <Link
              key={index}
              to={`/topics/${currentSubject}/${encodeURIComponent(topic.name)}`}
              className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              {/* Card Hover Highlight (Subtle gradient on hover) */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center group-hover:bg-blue-900/20 group-hover:border-blue-500/30 transition-colors duration-300">
                    <span className="text-3xl">
                      {/* Simple logic to vary icons based on index, can be replaced with specific topic icons later */}
                      {index % 3 === 0 ? '🔢' : index % 3 === 1 ? '📊' : '📐'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {topic.name}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {topic.description || 'Start learning this topic with personalized AI guidance and real-time feedback.'}
                </p>
                
                <div className="pt-4 border-t border-slate-800 flex items-center text-blue-400 text-sm font-bold tracking-wide">
                  <span>START LEARNING</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {topics.length === 0 && (
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl grayscale opacity-50">📦</span>
            </div>
            <p className="text-slate-300 text-xl font-semibold mb-2">No topics available yet</p>
            <p className="text-slate-500">We are currently updating the curriculum. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;