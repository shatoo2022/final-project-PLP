// 1. Load environment variables FIRST
require('dotenv').config(); 

// 2. Import the Groq SDK
const Groq = require('groq-sdk'); 

// 3. Initialize the client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});



// Generate lesson content
const generateLessonContent = async (subject, topic, gradeLevel, lessonNumber) => {
  try {
    const prompt = `You are an expert ${subject} tutor for secondary school students (Grade ${gradeLevel}).

Create a comprehensive lesson on "${topic}" - Lesson ${lessonNumber}.

Structure your response as JSON with this exact format:
{
  "title": "Lesson title here",
  "introduction": "Brief engaging introduction (2-3 sentences)",
  "steps": ["Step 1 explanation", "Step 2 explanation", "Step 3 explanation", "..."],
  "examples": ["Example 1 with solution", "Example 2 with solution", "Example 3 with solution"],
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "..."]
}

Guidelines:
- Make it age-appropriate for Grade ${gradeLevel} students
- Use clear, simple language
- Include 4-6 steps breaking down the concept
- Provide 3-4 worked examples with detailed solutions
- List 4-6 key takeaways
- Be encouraging and positive in tone

Return ONLY valid JSON, no additional text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    
    // Parse JSON response
    const lessonData = JSON.parse(content);
    
    return lessonData;
  } catch (error) {
    console.error('Error generating lesson content:', error);
    throw new Error('Failed to generate lesson content');
  }
};

// Generate practice problems
const generatePracticeProblems = async (subject, topic, gradeLevel, difficulty = 'medium', count = 5) => {
  try {
    const prompt = `You are an expert ${subject} tutor for Grade ${gradeLevel} students.

Generate ${count} practice problems on "${topic}" with ${difficulty} difficulty.

Structure your response as JSON array with this exact format:
[
  {
    "question": "Problem statement here",
    "answer": "Correct answer here",
    "explanation": "Step-by-step solution explanation",
    "difficulty": "${difficulty}"
  }
]

Guidelines:
- Make problems appropriate for Grade ${gradeLevel}
- Difficulty level: ${difficulty}
- Include variety in problem types
- Provide clear, detailed explanations
- Make answers concise but complete

Return ONLY valid JSON array, no additional text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL,
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    const problems = JSON.parse(content);
    
    return problems;
  } catch (error) {
    console.error('Error generating practice problems:', error);
    throw new Error('Failed to generate practice problems');
  }
};

// Generate quiz questions for assessment
const generateQuizQuestions = async (subject, topic, gradeLevel, count = 5) => {
  try {
    const prompt = `You are an expert ${subject} tutor creating an assessment for Grade ${gradeLevel} students.

Generate ${count} multiple-choice quiz questions on "${topic}" to test understanding.

Structure your response as JSON array with this exact format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B",
    "explanation": "Why this is correct and others are wrong"
  }
]

Guidelines:
- Mix of difficulty levels (2 easy, 2 medium, 1 hard)
- Test different aspects of the topic
- Make distractors (wrong answers) plausible
- Provide clear explanations
- Age-appropriate for Grade ${gradeLevel}

Return ONLY valid JSON array, no additional text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    const questions = JSON.parse(content);
    
    return questions;
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions');
  }
};

// AI Tutor - Answer student questions
const answerStudentQuestion = async (question, context) => {
  try {
    const { subject, topic, gradeLevel, conversationHistory = [] } = context;

    const systemPrompt = `You are a patient, encouraging ${subject} tutor for Grade ${gradeLevel} students. 
Current topic: "${topic}"

Teaching principles:
- Use simple, clear language appropriate for Grade ${gradeLevel}
- Break down complex ideas into smaller steps
- Use analogies and real-world examples
- Be encouraging and positive
- If the student is stuck, provide hints rather than direct answers
- Ask guiding questions to help them think
- Celebrate their progress and effort`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: question }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: process.env.GROQ_MODEL,
      temperature: 0.8,
      max_tokens: 500,
    });

    const answer = completion.choices[0].message.content;
    
    return answer;
  } catch (error) {
    console.error('Error answering student question:', error);
    throw new Error('Failed to answer question');
  }
};

// Generate hint for struggling student
const generateHint = async (problem, studentAttempt, subject) => {
  try {
    const prompt = `You are a ${subject} tutor. A student is struggling with this problem:

Problem: ${problem}
Student's attempt: ${studentAttempt || 'No attempt yet'}

Provide a helpful hint that guides them toward the solution without giving the answer directly.
Be encouraging and focus on the next step they should take.

Keep the hint concise (2-3 sentences).`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 200,
    });

    const hint = completion.choices[0].message.content;
    
    return hint;
  } catch (error) {
    console.error('Error generating hint:', error);
    throw new Error('Failed to generate hint');
  }
};

module.exports = {
  generateLessonContent,
  generatePracticeProblems,
  generateQuizQuestions,
  answerStudentQuestion,
  generateHint,
};