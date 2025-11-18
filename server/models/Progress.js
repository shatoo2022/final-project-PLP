const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
    enum: ['Mathematics', 'English'],
  },
  topic: {
    type: String,
    required: true,
  },
  lessonsCompleted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  }],
  currentLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  },
  assessmentScores: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    score: Number,
    totalQuestions: Number,
    passed: Boolean,
    completedAt: Date,
  }],
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0,
  },
  accuracyRate: {
    type: Number, // percentage
    default: 0,
  },
  strugglingAreas: [String],
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for userId, subject, and topic
progressSchema.index({ userId: 1, subject: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);