import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { lessonAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Lesson = () => {
  const { subject, topic, lessonNumber } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(true); // Default to true for desktop visibility
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchLesson();
  }, [subject, topic, lessonNumber]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lessonAPI.getLesson(subject, topic, lessonNumber);
      setLesson(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load lesson');
      console.error('Error fetching lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingMessage) return;

    const userMessage = chatInput.trim();
    setChatInput('');

    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setSendingMessage(true);

    try {
      const response = await lessonAPI.askTutor({
        question: userMessage,
        subject,
        topic,
        conversationHistory: chatMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.data.answer 
      }]);
    } catch (err) {
      console.error('Error asking tutor:', err);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setSendingMessage(false);
    }
  };

  const goToQuiz = () => {
    navigate(`/quiz/${lesson._id}`);
  };

  // Shared Glass Card Class
  const cardClass = "bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-lg";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Generating your personalized lesson..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Lesson</h3>
            <p className="text-red-200">{error}</p>
            <Link to={`/topics/${subject}/${topic}`} className="mt-4 inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors">
              Back to Topics
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-200 relative overflow-x-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* === MAIN LESSON CONTENT (Left Column) === */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Card */}
            <div className={cardClass}>
              <Link to={`/topics/${subject}/${topic}`} className="text-blue-400 hover:text-blue-300 font-medium mb-4 inline-flex items-center transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                Back to {topic}
              </Link>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                    {lesson.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Lesson {lesson.lessonNumber}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> {lesson.estimatedTime || 30} mins</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="capitalize bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">{lesson.difficulty || 'beginner'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Introduction */}
            {lesson.content.introduction && (
              <div className={cardClass}>
                <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Introduction</h2>
                <p className="text-slate-300 leading-relaxed text-lg">{lesson.content.introduction}</p>
              </div>
            )}

            {/* Steps */}
            {lesson.content.steps && lesson.content.steps.length > 0 && (
              <div className={cardClass}>
                <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Step-by-Step Guide</h2>
                <div className="space-y-6">
                  {lesson.content.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4 group">
                      <div className="flex-shrink-0 w-10 h-10 bg-slate-800 text-blue-400 border border-slate-700 rounded-xl flex items-center justify-center font-bold text-lg group-hover:border-blue-500 group-hover:text-white group-hover:bg-blue-600 transition-all duration-300 shadow-lg">
                        {index + 1}
                      </div>
                      <p className="text-slate-300 leading-relaxed flex-1 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples - Dark Blue Theme */}
            {lesson.content.examples && lesson.content.examples.length > 0 && (
              <div className={cardClass}>
                <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Examples</h2>
                <div className="space-y-6">
                  {lesson.content.examples.map((example, index) => (
                    <div key={index} className="p-5 bg-blue-950/30 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-colors">
                      <p className="text-sm font-bold text-blue-400 mb-3 uppercase tracking-wider">Example {index + 1}</p>
                      <p className="text-slate-200 whitespace-pre-line font-medium">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Points - Emerald Theme */}
            {lesson.content.keyPoints && lesson.content.keyPoints.length > 0 && (
              <div className="bg-emerald-950/20 backdrop-blur-md border border-emerald-500/20 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center">
                  <span className="mr-2">🎯</span> Key Takeaways
                </h2>
                <ul className="space-y-3">
                  {lesson.content.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3 text-slate-300">
                      <svg className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practice Problems */}
            {lesson.practiceProblems && lesson.practiceProblems.length > 0 && (
              <div className={cardClass}>
                <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Practice Problems</h2>
                <div className="space-y-4">
                  {lesson.practiceProblems.map((problem, index) => (
                    <div key={index} className="p-5 bg-slate-800/50 border border-slate-700 rounded-xl">
                      <p className="font-bold text-white mb-2">Problem {index + 1}</p>
                      <p className="text-slate-300 mb-4">{problem.question}</p>
                      <details className="group">
                        <summary className="cursor-pointer text-blue-400 hover:text-blue-300 font-medium list-none flex items-center">
                          <span className="mr-2 group-open:rotate-90 transition-transform">▶</span>
                          Show Answer & Explanation
                        </summary>
                        <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-800 animate-fadeIn">
                          <p className="font-bold text-emerald-400 mb-2">Answer: {problem.answer}</p>
                          <p className="text-slate-400 text-sm leading-relaxed">{problem.explanation}</p>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Lesson / Quiz Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 p-8 rounded-2xl relative overflow-hidden text-center sm:text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ready for the Quiz? 🎓</h3>
                  <p className="text-slate-300 max-w-md">
                    Test your understanding with a quick assessment. You need 70% to pass and unlock the next lesson!
                  </p>
                </div>
                <button onClick={goToQuiz} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1 whitespace-nowrap">
                  Take Assessment →
                </button>
              </div>
            </div>
          </div>

          {/* === AI TUTOR CHAT SIDEBAR (Right Column) === */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 h-[calc(100vh-3rem)] flex flex-col bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between z-20">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h3 className="font-bold text-white">AI Tutor 🤖</h3>
                </div>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="text-xs text-slate-400 hover:text-white uppercase tracking-wider"
                >
                  {showChat ? 'Minimize' : 'Expand'}
                </button>
              </div>

              {showChat ? (
                <>
                  {/* Chat Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-10 opacity-50">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">👋</span>
                        </div>
                        <p className="text-slate-300 text-sm font-medium">I'm your AI Tutor.</p>
                        <p className="text-slate-500 text-xs mt-1">Ask me anything about this lesson!</p>
                      </div>
                    ) : (
                      chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[90%] p-3 rounded-2xl text-sm leading-relaxed ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                            }`}
                          >
                            {message.content}
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 px-1">
                            {message.role === 'user' ? 'You' : 'AI'}
                          </span>
                        </div>
                      ))
                    )}
                    
                    {sendingMessage && (
                      <div className="flex items-start space-x-2">
                         <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex space-x-1">
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                         </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input Area */}
                  <div className="p-4 bg-slate-900 border-t border-slate-800 z-20">
                    <form onSubmit={handleAskQuestion} className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 bg-slate-950 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        disabled={sendingMessage}
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim() || sendingMessage}
                        className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 text-center cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => setShowChat(true)}>
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">💬</span>
                  </div>
                  <p className="text-sm">Click to chat</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;