const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    enum: ['Mathematics', 'English'],
  },
  topic: {
    type: String,
    required: true,
  },
  lessonNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  content: {
    introduction: String,
    steps: [String],
    examples: [String],
    keyPoints: [String],
  },
  practiceProblems: [{
    question: String,
    answer: String,
    explanation: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
    },
  }],
  estimatedTime: {
    type: Number, // in minutes
    default: 30,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for subject, topic, and lesson number
lessonSchema.index({ subject: 1, topic: 1, lessonNumber: 1 }, { unique: true });

module.exports = mongoose.model('Lesson', lessonSchema);