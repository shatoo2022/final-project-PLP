const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');

// @desc    Get user's overall progress
// @route   GET /api/progress
// @access  Private
const getOverallProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const allProgress = await Progress.find({ userId })
      .populate('lessonsCompleted', 'title lessonNumber')
      .populate('currentLesson', 'title lessonNumber');

    // Calculate overall statistics
    const totalLessonsCompleted = allProgress.reduce(
      (sum, p) => sum + p.lessonsCompleted.length,
      0
    );

    const totalTimeSpent = allProgress.reduce(
      (sum, p) => sum + p.totalTimeSpent,
      0
    );

    const averageAccuracy = allProgress.length > 0
      ? Math.round(
          allProgress.reduce((sum, p) => sum + p.accuracyRate, 0) / allProgress.length
        )
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLessonsCompleted,
        totalTimeSpent,
        averageAccuracy,
        progressBySubject: allProgress,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get progress for a specific subject
// @route   GET /api/progress/:subject
// @access  Private
const getProgressBySubject = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subject } = req.params;

    const progress = await Progress.find({ userId, subject })
      .populate('lessonsCompleted', 'title lessonNumber')
      .populate('currentLesson', 'title lessonNumber');

    if (progress.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No progress found for ${subject}`,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get progress for a specific topic
// @route   GET /api/progress/:subject/:topic
// @access  Private
const getProgressByTopic = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subject, topic } = req.params;

    const progress = await Progress.findOne({ userId, subject, topic })
      .populate('lessonsCompleted', 'title lessonNumber')
      .populate('currentLesson', 'title lessonNumber');

    if (!progress) {
      return res.status(200).json({
        success: true,
        message: `No progress found for ${subject} - ${topic}`,
        data: null,
      });
    }

    // Get all lessons for this topic to calculate completion percentage
    const allLessons = await Lesson.find({ subject, topic });
    const completionPercentage = allLessons.length > 0
      ? Math.round((progress.lessonsCompleted.length / allLessons.length) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        ...progress.toObject(),
        totalLessons: allLessons.length,
        completionPercentage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update time spent on a lesson
// @route   PUT /api/progress/time
// @access  Private
const updateTimeSpent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subject, topic, timeSpent } = req.body;

    if (!subject || !topic || timeSpent === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, topic, and timeSpent',
      });
    }

    let progress = await Progress.findOne({ userId, subject, topic });

    if (!progress) {
      progress = await Progress.create({
        userId,
        subject,
        topic,
        totalTimeSpent: timeSpent,
      });
    } else {
      progress.totalTimeSpent += timeSpent;
      progress.lastAccessed = new Date();
      await progress.save();
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getOverallProgress,
  getProgressBySubject,
  getProgressByTopic,
  updateTimeSpent,
};