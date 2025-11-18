const Assessment = require('../models/Assessment');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const { generateQuizQuestions } = require('../services/aiService');

// @desc    Generate or get quiz for a lesson
// @route   GET /api/assessments/lesson/:lessonId
// @access  Private
const getQuizForLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user._id;

    // Check if lesson exists
    const lesson = await Lesson.findById(lessonId);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Check if user has already taken this assessment
    const existingAssessment = await Assessment.findOne({
      userId,
      lessonId,
    }).sort({ completedAt: -1 }); // Get most recent attempt

    // If user already passed, return their result
    if (existingAssessment && existingAssessment.passed) {
      return res.status(200).json({
        success: true,
        message: 'You have already passed this assessment',
        data: {
          alreadyPassed: true,
          previousScore: existingAssessment.score,
          percentage: existingAssessment.percentage,
          completedAt: existingAssessment.completedAt,
        },
      });
    }

    // Generate new quiz questions using AI
    console.log(`Generating quiz for: ${lesson.subject} - ${lesson.topic}`);
    
    const questions = await generateQuizQuestions(
      lesson.subject,
      lesson.topic,
      req.user.gradeLevel,
      5 // Generate 5 questions
    );

    // Remove correct answers before sending to student
    const questionsForStudent = questions.map((q, index) => ({
      questionNumber: index + 1,
      question: q.question,
      options: q.options,
    }));

    // Store the quiz questions temporarily (we'll need them for grading)
    // In production, you might want to cache these or store them differently
    const quizData = {
      lessonId,
      questions: questions, // Full questions with answers
      generatedAt: new Date(),
    };

    res.status(200).json({
      success: true,
      data: {
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        subject: lesson.subject,
        topic: lesson.topic,
        totalQuestions: questions.length,
        passingPercentage: 70,
        questions: questionsForStudent,
        quizId: lesson._id.toString(), // Use lessonId as quizId for simplicity
      },
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit quiz answers and get results
// @route   POST /api/assessments/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { lessonId, answers, timeSpent } = req.body;
    const userId = req.user._id;

    // Validation
    if (!lessonId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide lessonId and answers array',
      });
    }

    // Get the lesson
    const lesson = await Lesson.findById(lessonId);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Generate quiz questions again to compare answers
    // In production, you might want to store these temporarily to avoid regenerating
    const correctQuestions = await generateQuizQuestions(
      lesson.subject,
      lesson.topic,
      req.user.gradeLevel,
      5
    );

    // Grade the quiz
    let correctCount = 0;
    const gradedQuestions = answers.map((studentAnswer, index) => {
      const correctQuestion = correctQuestions[index];
      const isCorrect = studentAnswer.answer === correctQuestion.correctAnswer;
      
      if (isCorrect) correctCount++;

      return {
        question: correctQuestion.question,
        options: correctQuestion.options,
        correctAnswer: correctQuestion.correctAnswer,
        studentAnswer: studentAnswer.answer,
        isCorrect,
        explanation: correctQuestion.explanation,
      };
    });

    // Calculate score
    const totalQuestions = answers.length;
    const score = correctCount;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 70;

    // Create assessment record
    const assessment = await Assessment.create({
      lessonId,
      userId,
      questions: gradedQuestions,
      score,
      percentage,
      totalQuestions,
      passed,
      timeSpent: timeSpent || 0,
    });

    // Update user progress
    await updateProgressAfterQuiz(userId, lesson, assessment);

    res.status(200).json({
      success: true,
      data: {
        assessmentId: assessment._id,
        score,
        totalQuestions,
        percentage,
        passed,
        passingPercentage: 70,
        message: passed 
          ? '🎉 Congratulations! You passed the assessment!' 
          : '📚 Keep studying! You need 70% to pass.',
        questions: gradedQuestions,
        nextSteps: passed 
          ? 'You can now proceed to the next lesson!' 
          : 'Review the lesson and try again.',
      },
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get assessment history for a user
// @route   GET /api/assessments/history
// @access  Private
const getAssessmentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subject, topic } = req.query;

    // Build query
    let query = { userId };
    
    if (subject || topic) {
      // Need to populate lesson to filter by subject/topic
      const assessments = await Assessment.find(query)
        .populate('lessonId')
        .sort({ completedAt: -1 });

      let filteredAssessments = assessments;

      if (subject) {
        filteredAssessments = filteredAssessments.filter(
          a => a.lessonId && a.lessonId.subject === subject
        );
      }

      if (topic) {
        filteredAssessments = filteredAssessments.filter(
          a => a.lessonId && a.lessonId.topic === topic
        );
      }

      return res.status(200).json({
        success: true,
        count: filteredAssessments.length,
        data: filteredAssessments,
      });
    }

    // Get all assessments
    const assessments = await Assessment.find(query)
      .populate('lessonId', 'title subject topic lessonNumber')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get assessment statistics
// @route   GET /api/assessments/stats
// @access  Private
const getAssessmentStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const assessments = await Assessment.find({ userId })
      .populate('lessonId', 'subject topic');

    if (assessments.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalAssessments: 0,
          averageScore: 0,
          passRate: 0,
          totalTimeSpent: 0,
        },
      });
    }

    // Calculate statistics
    const totalAssessments = assessments.length;
    const passedAssessments = assessments.filter(a => a.passed).length;
    const totalScore = assessments.reduce((sum, a) => sum + a.percentage, 0);
    const totalTimeSpent = assessments.reduce((sum, a) => sum + (a.timeSpent || 0), 0);

    const stats = {
      totalAssessments,
      passedAssessments,
      failedAssessments: totalAssessments - passedAssessments,
      averageScore: Math.round(totalScore / totalAssessments),
      passRate: Math.round((passedAssessments / totalAssessments) * 100),
      totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
      bySubject: {},
    };

    // Group by subject
    assessments.forEach(assessment => {
      if (assessment.lessonId && assessment.lessonId.subject) {
        const subject = assessment.lessonId.subject;
        
        if (!stats.bySubject[subject]) {
          stats.bySubject[subject] = {
            total: 0,
            passed: 0,
            averageScore: 0,
            scores: [],
          };
        }

        stats.bySubject[subject].total++;
        if (assessment.passed) stats.bySubject[subject].passed++;
        stats.bySubject[subject].scores.push(assessment.percentage);
      }
    });

    // Calculate average scores by subject
    Object.keys(stats.bySubject).forEach(subject => {
      const subjectData = stats.bySubject[subject];
      const avgScore = subjectData.scores.reduce((a, b) => a + b, 0) / subjectData.scores.length;
      subjectData.averageScore = Math.round(avgScore);
      delete subjectData.scores; // Remove raw scores from response
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Retry a failed assessment
// @route   GET /api/assessments/retry/:lessonId
// @access  Private
const retryAssessment = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user._id;

    // Check previous attempt
    const previousAssessment = await Assessment.findOne({
      userId,
      lessonId,
    }).sort({ completedAt: -1 });

    if (!previousAssessment) {
      return res.status(404).json({
        success: false,
        message: 'No previous assessment found for this lesson',
      });
    }

    if (previousAssessment.passed) {
      return res.status(400).json({
        success: false,
        message: 'You have already passed this assessment',
      });
    }

    // Allow retry - generate new quiz
    // Redirect to getQuizForLesson
    req.params.lessonId = lessonId;
    return getQuizForLesson(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to update progress after quiz
const updateProgressAfterQuiz = async (userId, lesson, assessment) => {
  try {
    let progress = await Progress.findOne({
      userId,
      subject: lesson.subject,
      topic: lesson.topic,
    });

    if (!progress) {
      progress = await Progress.create({
        userId,
        subject: lesson.subject,
        topic: lesson.topic,
        lessonsCompleted: [],
        assessmentScores: [],
      });
    }

    // Add assessment score
    progress.assessmentScores.push({
      lessonId: lesson._id,
      score: assessment.score,
      totalQuestions: assessment.totalQuestions,
      passed: assessment.passed,
      completedAt: assessment.completedAt,
    });

    // If passed, mark lesson as completed
    if (assessment.passed && !progress.lessonsCompleted.includes(lesson._id)) {
      progress.lessonsCompleted.push(lesson._id);
    }

    // Update accuracy rate
    const allScores = progress.assessmentScores;
    const totalCorrect = allScores.reduce((sum, s) => sum + s.score, 0);
    const totalQuestions = allScores.reduce((sum, s) => sum + s.totalQuestions, 0);
    progress.accuracyRate = Math.round((totalCorrect / totalQuestions) * 100);

    // Update struggling areas if failed
    if (!assessment.passed && !progress.strugglingAreas.includes(lesson.topic)) {
      progress.strugglingAreas.push(lesson.topic);
    }

    // Remove from struggling areas if passed
    if (assessment.passed) {
      progress.strugglingAreas = progress.strugglingAreas.filter(
        area => area !== lesson.topic
      );
    }

    progress.lastAccessed = new Date();
    await progress.save();
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

module.exports = {
  getQuizForLesson,
  submitQuiz,
  getAssessmentHistory,
  getAssessmentStats,
  retryAssessment,
};