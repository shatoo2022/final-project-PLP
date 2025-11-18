import axios from 'axios';

// 1. UPDATE: Use Environment Variable for dynamic URL switching
// Vercel will provide VITE_API_URL. Localhost will use the fallback.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/updateprofile', data),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
};

// Lesson endpoints
export const lessonAPI = {
  getTopics: (subject) => api.get(`/lessons/${subject}/topics`),
  getLessonsByTopic: (subject, topic) => api.get(`/lessons/${subject}/${topic}`),
  getLesson: (subject, topic, lessonNumber) => 
    api.get(`/lessons/${subject}/${topic}/${lessonNumber}`),
  askTutor: (data) => api.post('/lessons/ask', data),
  getHint: (data) => api.post('/lessons/hint', data),
};

// Assessment endpoints
export const assessmentAPI = {
  getQuiz: (lessonId) => api.get(`/assessments/lesson/${lessonId}`),
  submitQuiz: (data) => api.post('/assessments/submit', data),
  getHistory: (params) => api.get('/assessments/history', { params }),
  getStats: () => api.get('/assessments/stats'),
  retryAssessment: (lessonId) => api.get(`/assessments/retry/${lessonId}`),
};

// Progress endpoints
export const progressAPI = {
  getOverall: () => api.get('/progress'),
  getBySubject: (subject) => api.get(`/progress/${subject}`),
  getByTopic: (subject, topic) => api.get(`/progress/${subject}/${topic}`),
  updateTime: (data) => api.put('/progress/time', data),
};

export default api;