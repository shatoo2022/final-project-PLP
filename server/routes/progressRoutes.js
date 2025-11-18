const express = require('express');
const {
  getOverallProgress,
  getProgressBySubject,
  getProgressByTopic,
  updateTimeSpent,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Get overall progress
router.get('/', getOverallProgress);

// Update time spent
router.put('/time', updateTimeSpent);

// Get progress by subject
router.get('/:subject', getProgressBySubject);

// Get progress by topic
router.get('/:subject/:topic', getProgressByTopic);

module.exports = router;