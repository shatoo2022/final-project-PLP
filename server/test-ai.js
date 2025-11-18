const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { generateLessonContent } = require('./services/aiService');

dotenv.config();

const testAI = async () => {
  try {
    console.log('🤖 Testing AI lesson generation...\n');
    
    const lesson = await generateLessonContent(
      'Mathematics',
      'Basic Algebra',
      10,
      1
    );
    
    console.log('✅ SUCCESS! AI Generated Lesson:\n');
    console.log(JSON.stringify(lesson, null, 2));
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
};

testAI();