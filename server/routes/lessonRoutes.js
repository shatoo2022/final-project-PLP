const express = require('express');
const {
  getLesson,
  getLessonsByTopic,
  getTopicsBySubject,
  askTutor,
  getHint,
} = require('../controllers/lessonController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Get topics for a subject
router.get('/:subject/topics', getTopicsBySubject);

// Get all lessons for a specific topic
router.get('/:subject/:topic', getLessonsByTopic);

// Get or generate a specific lesson
router.get('/:subject/:topic/:lessonNumber', getLesson);

// Ask AI tutor a question
router.post('/ask', askTutor);

// Get hint for a problem
router.post('/hint', getHint);

module.exports = router;