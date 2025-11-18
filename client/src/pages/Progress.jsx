import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressAPI, assessmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Progress = () => {
  const { user } = useAuth();
  const [overallProgress, setOverallProgress] = useState(null);
  const [assessmentStats, setAssessmentStats] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [progressRes, statsRes, historyRes] = await Promise.all([
        progressAPI.getOverall(),
        assessmentAPI.getStats(),
        assessmentAPI.getHistory(),
      ]);

      setOverallProgress(progressRes.data.data);
      setAssessmentStats(statsRes.data.data);
      setAssessmentHistory(historyRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load progress data');
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <LoadingSpinner message="Loading your progress..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Progress 📊</h1>
          <p className="text-gray-600 mt-2">Track your learning journey and achievements</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('assessments')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assessments'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Assessment History
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Lessons Completed</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {overallProgress?.totalLessonsCompleted || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Accuracy</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {overallProgress?.averageAccuracy || 0}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Time Spent</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {overallProgress?.totalTimeSpent || 0}
                    </p>
                    <p className="text-xs text-gray-500">minutes</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⏱️</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pass Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {assessmentStats?.passRate || 0}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Statistics */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Statistics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {assessmentStats?.totalAssessments || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Attempts</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    {assessmentStats?.passedAssessments || 0}
                  </p>
                  <p className="text-sm text-gray-600">Passed</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-3xl font-bold text-red-600 mb-1">
                    {assessmentStats?.failedAssessments || 0}
                  </p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>

              {assessmentStats?.averageScore !== undefined && (
                <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Average Score</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {assessmentStats.averageScore}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${assessmentStats.averageScore}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress by Subject */}
            {assessmentStats?.bySubject && Object.keys(assessmentStats.bySubject).length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress by Subject</h2>
                <div className="space-y-4">
                  {Object.entries(assessmentStats.bySubject).map(([subject, data]) => (
                    <div key={subject} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            {subject === 'Mathematics' ? '📐' : '📚'}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{subject}</h3>
                            <p className="text-sm text-gray-600">
                              {data.passed}/{data.total} assessments passed
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{data.averageScore}%</p>
                          <p className="text-xs text-gray-500">avg score</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(data.passed / data.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subject Progress Details */}
            {overallProgress?.progressBySubject && overallProgress.progressBySubject.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Progress</h2>
                <div className="space-y-4">
                  {overallProgress.progressBySubject.map((progress) => (
                    <div key={progress._id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{progress.subject}</h3>
                          <p className="text-sm text-gray-600">{progress.topic}</p>
                        </div>
                        <Link
                          to={`/topics/${progress.subject}/${progress.topic}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Continue →
                        </Link>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {progress.lessonsCompleted?.length || 0}
                          </p>
                          <p className="text-gray-600">Lessons</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{progress.accuracyRate || 0}%</p>
                          <p className="text-gray-600">Accuracy</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{progress.totalTimeSpent || 0}</p>
                          <p className="text-gray-600">Minutes</p>
                        </div>
                      </div>

                      {progress.strugglingAreas && progress.strugglingAreas.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm font-semibold text-yellow-800 mb-1">
                            Areas to Review:
                          </p>
                          <p className="text-sm text-yellow-700">
                            {progress.strugglingAreas.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!overallProgress?.progressBySubject || overallProgress.progressBySubject.length === 0) && (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start Your Learning Journey!
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't started any lessons yet. Begin learning today!
                </p>
                <Link to="/dashboard" className="btn-primary inline-block">
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Assessment History Tab */}
        {activeTab === 'assessments' && (
          <div className="space-y-4">
            {assessmentHistory.length > 0 ? (
              assessmentHistory.map((assessment) => (
                <div
                  key={assessment._id}
                  className={`card ${
                    assessment.passed
                      ? 'border-green-200 bg-green-50'
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">
                          {assessment.passed ? '✅' : '📝'}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {assessment.lessonId?.title || 'Assessment'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {assessment.lessonId?.subject} - {assessment.lessonId?.topic}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div>
                          <span className="text-gray-600">Score: </span>
                          <span className="font-semibold text-gray-900">
                            {assessment.score}/{assessment.totalQuestions}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Percentage: </span>
                          <span
                            className={`font-semibold ${
                              assessment.passed ? 'text-green-600' : 'text-yellow-600'
                            }`}
                          >
                            {assessment.percentage}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Date: </span>
                          <span className="font-medium text-gray-900">
                            {new Date(assessment.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          assessment.passed
                            ? 'bg-green-200 text-green-800'
                            : 'bg-yellow-200 text-yellow-800'
                        }`}
                      >
                        {assessment.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Assessments Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Complete lessons and take assessments to see your history here.
                </p>
                <Link to="/dashboard" className="btn-primary inline-block">
                  Start Learning
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;