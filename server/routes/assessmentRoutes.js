const express = require('express');
const {
  getQuizForLesson,
  submitQuiz,
  getAssessmentHistory,
  getAssessmentStats,
  retryAssessment,
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Get quiz for a specific lesson
router.get('/lesson/:lessonId', getQuizForLesson);

// Submit quiz answers
router.post('/submit', submitQuiz);

// Get assessment history
router.get('/history', getAssessmentHistory);

// Get assessment statistics
router.get('/stats', getAssessmentStats);

// Retry a failed assessment
router.get('/retry/:lessonId', retryAssessment);

module.exports = router;