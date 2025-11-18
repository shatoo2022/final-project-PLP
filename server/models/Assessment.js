const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [{
    question: String,
    options: [String], // for multiple choice
    correctAnswer: String,
    studentAnswer: String,
    isCorrect: Boolean,
    explanation: String,
  }],
  score: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    default: false,
  },
  timeSpent: {
    type: Number, // in seconds
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for userId and lessonId
assessmentSchema.index({ userId: 1, lessonId: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);