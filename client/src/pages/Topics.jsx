import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { lessonAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Topics = () => {
  const { subject, topic } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLessons();
  }, [subject, topic]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lessonAPI.getLessonsByTopic(subject, topic);
      setLessons(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load lessons');
      console.error('Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const startLesson = (lessonNumber) => {
    navigate(`/lesson/${subject}/${topic}/${lessonNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading lessons..." />
      </div>
    );
  }

  return (
    // 1. BACKGROUND: Deep Slate
    <div className="min-h-screen bg-slate-950 py-8 relative overflow-hidden text-slate-200">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <Link to={`/subjects/${subject}`} className="text-blue-400 hover:text-blue-300 font-medium mb-4 inline-flex items-center transition-colors group">
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Back to {subject}
          </Link>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                {topic}
              </h1>
              <p className="text-slate-400 mt-2 text-lg">
                {lessons.length > 0 
                  ? `${lessons.length} lesson${lessons.length > 1 ? 's' : ''} available` 
                  : 'Start your first lesson below'}
              </p>
            </div>
            
            {/* Optional Topic Icon/Badge */}
            <div className="w-16 h-16 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center shadow-lg">
              <span className="text-3xl">📖</span>
            </div>
          </div>
        </div>

        {/* Error Message (Styled for Dark Mode) */}
        {error && (
          <div className="mb-8 bg-amber-900/20 border border-amber-500/30 p-6 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <p className="text-amber-200 font-semibold mb-1">{error}</p>
              <p className="text-amber-400/80 text-sm">
                Don't worry! Click "Start Lesson 1" below and our AI will generate it for you instantly.
              </p>
            </div>
          </div>
        )}

        {/* Lessons List */}
        <div className="space-y-6">
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <div 
                key={lesson._id} 
                className="group bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(37,99,235,0.1)] transition-all duration-300 cursor-pointer relative overflow-hidden"
                onClick={() => startLesson(lesson.lessonNumber)}
              >
                 {/* Hover Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start sm:items-center space-x-6 flex-1">
                    
                    {/* Number Badge */}
                    <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors duration-300 shadow-lg">
                      <span className="font-bold text-xl text-blue-400 group-hover:text-white transition-colors">
                        {lesson.lessonNumber}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                        {lesson.title}
                      </h3>
                      
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-slate-400 flex items-center bg-slate-950/50 px-3 py-1 rounded-full border border-slate-800">
                          <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {lesson.estimatedTime || 30} min
                        </span>
                        
                        {/* Dynamic Difficulty Badge */}
                        <span className={`text-xs px-3 py-1 rounded-full border font-medium uppercase tracking-wide ${
                          lesson.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          lesson.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {lesson.difficulty || 'beginner'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent double click event
                      startLesson(lesson.lessonNumber);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-800 text-white text-sm font-semibold rounded-xl border border-slate-700 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all shadow-md whitespace-nowrap"
                  >
                    Start Lesson
                  </button>
                </div>
              </div>
            ))
          ) : (
            // === START FIRST LESSON (Empty State) ===
            <div className="bg-gradient-to-r from-blue-900/20 to-slate-900 border border-blue-500/30 rounded-2xl p-8 text-center sm:text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    🚀 Ready to Start?
                  </h3>
                  <p className="text-slate-300 max-w-lg">
                    You haven't started this topic yet. Click the button to have our AI generate your personalized Lesson 1 instantly!
                  </p>
                </div>
                <button
                  onClick={() => startLesson(1)}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all transform hover:-translate-y-1 whitespace-nowrap"
                >
                  Generate Lesson 1
                </button>
              </div>
            </div>
          )}

          {/* === NEXT LESSON SUGGESTION === */}
          {lessons.length > 0 && (
            <div className="mt-8 p-8 border border-dashed border-slate-700 rounded-2xl bg-slate-900/30 hover:bg-slate-900/50 transition-colors text-center">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Continue Learning
              </h3>
              <p className="text-slate-400 mb-6">
                Ready to move forward? Generate the next lesson in this series.
              </p>
              <button
                onClick={() => startLesson(lessons.length + 1)}
                className="px-8 py-3 bg-slate-800 text-white border border-slate-600 rounded-xl hover:bg-white hover:text-slate-900 hover:border-white transition-all font-semibold shadow-lg"
              >
                Start Lesson {lessons.length + 1} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topics;