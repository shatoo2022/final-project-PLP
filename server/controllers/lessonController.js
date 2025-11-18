const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const {
  generateLessonContent,
  generatePracticeProblems,
  answerStudentQuestion,
  generateHint,
} = require('../services/aiService');

// @desc    Get or generate a lesson
// @route   GET /api/lessons/:subject/:topic/:lessonNumber
// @access  Private
const getLesson = async (req, res) => {
  try {
    const { subject, topic, lessonNumber } = req.params;
    const gradeLevel = req.user.gradeLevel;

    // Check if lesson already exists in database
    let lesson = await Lesson.findOne({
      subject,
      topic,
      lessonNumber: parseInt(lessonNumber),
    });

    // If lesson doesn't exist, generate it with AI
    if (!lesson) {
      console.log(`Generating new lesson: ${subject} - ${topic} - Lesson ${lessonNumber}`);
      
      const lessonContent = await generateLessonContent(
        subject,
        topic,
        gradeLevel,
        lessonNumber
      );

      const practiceProblems = await generatePracticeProblems(
        subject,
        topic,
        gradeLevel,
        'medium',
        5
      );

      // Create and save the lesson
      lesson = await Lesson.create({
        subject,
        topic,
        lessonNumber: parseInt(lessonNumber),
        title: lessonContent.title,
        difficulty: 'beginner',
        content: {
          introduction: lessonContent.introduction,
          steps: lessonContent.steps,
          examples: lessonContent.examples,
          keyPoints: lessonContent.keyPoints,
        },
        practiceProblems,
        estimatedTime: 30,
      });
    }

    // Update user progress
    await updateUserProgress(req.user._id, subject, topic, lesson._id);

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error('Error in getLesson:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all lessons for a topic
// @route   GET /api/lessons/:subject/:topic
// @access  Private
const getLessonsByTopic = async (req, res) => {
  try {
    const { subject, topic } = req.params;

    const lessons = await Lesson.find({ subject, topic }).sort({ lessonNumber: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all available topics for a subject
// @route   GET /api/lessons/:subject/topics
// @access  Private
const getTopicsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    // Get unique topics for the subject
    const topics = await Lesson.distinct('topic', { subject });

    // For MVP, if no lessons exist, return predefined topics
    const predefinedTopics = {
      Mathematics: [
        { name: 'Basic Algebra', description: 'Learn to solve simple equations' },
        { name: 'Fractions', description: 'Master operations with fractions' },
        { name: 'Geometry Basics', description: 'Understand areas and perimeters' },
      ],
      English: [
        { name: 'Grammar Fundamentals', description: 'Parts of speech and sentence structure' },
        { name: 'Vocabulary Building', description: 'Expand your word knowledge' },
        { name: 'Reading Comprehension', description: 'Improve understanding of texts' },
      ],
    };

    const topicsData = topics.length > 0 
      ? topics.map(topic => ({ name: topic, description: '' }))
      : predefinedTopics[subject] || [];

    res.status(200).json({
      success: true,
      data: topicsData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Ask AI tutor a question
// @route   POST /api/lessons/ask
// @access  Private
const askTutor = async (req, res) => {
  try {
    const { question, subject, topic, conversationHistory } = req.body;
    const gradeLevel = req.user.gradeLevel;

    if (!question || !subject || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide question, subject, and topic',
      });
    }

    const context = {
      subject,
      topic,
      gradeLevel,
      conversationHistory: conversationHistory || [],
    };

    const answer = await answerStudentQuestion(question, context);

    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get hint for a problem
// @route   POST /api/lessons/hint
// @access  Private
const getHint = async (req, res) => {
  try {
    const { problem, studentAttempt, subject } = req.body;

    if (!problem || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide problem and subject',
      });
    }

    const hint = await generateHint(problem, studentAttempt, subject);

    res.status(200).json({
      success: true,
      data: {
        hint,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to update user progress
const updateUserProgress = async (userId, subject, topic, lessonId) => {
  try {
    let progress = await Progress.findOne({ userId, subject, topic });

    if (!progress) {
      progress = await Progress.create({
        userId,
        subject,
        topic,
        currentLesson: lessonId,
        lastAccessed: new Date(),
      });
    } else {
      progress.currentLesson = lessonId;
      progress.lastAccessed = new Date();
      await progress.save();
    }
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

module.exports = {
  getLesson,
  getLessonsByTopic,
  getTopicsBySubject,
  askTutor,
  getHint,
};