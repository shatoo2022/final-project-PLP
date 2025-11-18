import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Quiz = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchQuiz();
  }, [lessonId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await assessmentAPI.getQuiz(lessonId);
      
      if (response.data.data.alreadyPassed) {
        setResult({
          passed: true,
          ...response.data.data,
        });
      } else {
        setQuiz(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quiz');
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionNumber, answer) => {
    setAnswers({
      ...answers,
      [questionNumber]: answer,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(answers).length !== quiz.totalQuestions) {
      alert('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      const formattedAnswers = Object.entries(answers).map(([questionNumber, answer]) => ({
        questionNumber: parseInt(questionNumber),
        answer,
      }));

      const response = await assessmentAPI.submitQuiz({
        lessonId,
        answers: formattedAnswers,
        timeSpent,
      });

      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading quiz..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => navigate(-1)} 
              className="mt-4 text-red-300 hover:text-white underline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === SHOW RESULTS (Success/Fail Screen) ===
  if (result) {
    const passedBefore = result.previousScore !== undefined;
    
    return (
      <div className="min-h-screen bg-slate-950 py-12 overflow-x-hidden relative">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] blur-[120px] rounded-full pointer-events-none ${result.passed ? 'bg-emerald-600/10' : 'bg-red-600/10'}`} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`bg-slate-900/50 backdrop-blur-xl border p-8 md:p-10 rounded-3xl shadow-2xl ${result.passed ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
            
            {/* Result Header */}
            <div className="text-center mb-10">
              <div className="text-7xl mb-6 animate-bounce">
                {result.passed ? '🎉' : '📚'}
              </div>
              <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
                {passedBefore ? 'Already Completed!' : result.message}
              </h2>
              
              {passedBefore ? (
                <p className="text-slate-400 text-lg">
                  You passed this assessment on <span className="text-white font-medium">{new Date(result.completedAt).toLocaleDateString()}</span>
                </p>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 min-w-[140px]">
                    <p className={`text-5xl font-extrabold mb-1 ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>{result.percentage}%</p>
                    <p className="text-sm text-slate-400 uppercase tracking-wide font-semibold">Your Score</p>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 min-w-[140px]">
                    <p className="text-5xl font-extrabold text-white mb-1">{result.score}<span className="text-2xl text-slate-500">/{result.totalQuestions}</span></p>
                    <p className="text-sm text-slate-400 uppercase tracking-wide font-semibold">Correct Answers</p>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Review Section */}
            {!passedBefore && result.questions && (
              <div className="space-y-6 mb-10">
                <h3 className="text-2xl font-bold text-white border-b border-slate-700 pb-4">Review Your Answers</h3>
                {result.questions.map((q, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl border ${
                      q.isCorrect ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-red-900/10 border-red-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-slate-200">Question {index + 1}</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${q.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {q.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    <p className="text-white text-lg mb-4 font-medium">{q.question}</p>
                    
                    <div className="space-y-3 text-sm bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="text-slate-400">
                          Your answer: <span className={`font-bold ml-1 ${q.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>{q.studentAnswer}</span>
                        </p>
                        {!q.isCorrect && (
                           <p className="text-slate-400">
                             Correct answer: <span className="text-emerald-400 font-bold ml-1">{q.correctAnswer}</span>
                           </p>
                        )}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-800">
                        <p className="text-slate-500 font-bold text-xs uppercase mb-1">Explanation</p>
                        <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center gap-4">
              {result.passed ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1"
                >
                  Back to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-200 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
                  >
                    Retry Quiz
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-4 border border-slate-600 text-slate-300 hover:border-white hover:text-white font-bold rounded-xl transition-all"
                  >
                    Review Lesson
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === QUIZ FORM (Questions) ===
  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-200 relative">
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. NEW: Back to Lesson Button */}
        <div className="mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="text-slate-400 hover:text-blue-400 font-medium inline-flex items-center transition-colors group"
            >
                <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                Back to Lesson
            </button>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-500/20">Assessment</span>
              <span className="text-slate-400 text-sm font-medium">Passing Score: {quiz.passingPercentage}%</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {quiz.lessonTitle}
            </h1>
            <p className="text-slate-400">{quiz.totalQuestions} Questions • Multiple Choice</p>
          </div>

          {/* Quiz Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {quiz.questions.map((question, index) => (
              <div key={question.questionNumber} className="space-y-4 animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                <p className="text-lg font-semibold text-white leading-relaxed">
                  <span className="text-blue-500 mr-2">{question.questionNumber}.</span> 
                  {question.question}
                </p>
                
                <div className="grid gap-3 pl-0 md:pl-6">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = answers[question.questionNumber] === option;
                    return (
                      <label
                        key={optionIndex}
                        className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                          isSelected 
                            ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center h-5">
                          <input
                            type="radio"
                            name={`question-${question.questionNumber}`}
                            value={option}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(question.questionNumber, option)}
                            className="h-5 w-5 text-blue-600 border-slate-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                            required
                          />
                        </div>
                        <div className="ml-3 text-base">
                          <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                            {option}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Footer / Submit */}
            <div className="pt-8 border-t border-slate-800 sticky bottom-0 bg-slate-900/95 backdrop-blur-lg p-4 -mx-4 -mb-4 md:static md:bg-transparent md:p-0 md:m-0 rounded-b-2xl z-20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-slate-400 text-sm order-2 md:order-1">
                  <span className={Object.keys(answers).length === quiz.totalQuestions ? 'text-emerald-400 font-bold' : 'text-slate-200 font-bold'}>
                    {Object.keys(answers).length}
                  </span>
                  <span className="mx-1">/</span>
                  {quiz.totalQuestions} answered
                </p>
                
                <button
                  type="submit"
                  disabled={submitting || Object.keys(answers).length !== quiz.totalQuestions}
                  className="w-full md:w-auto order-1 md:order-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all transform hover:-translate-y-1"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Submitting...
                    </span>
                  ) : 'Submit Assessment'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Quiz;