import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Topics from './pages/Topics';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* 1. CHANGED: Added 'flex flex-col' and removed 'bg-gray-50' 
           (We handle the dark background in index.css now)
        */}
        <div className="min-h-screen flex flex-col text-slate-200">
          
          <Navbar />
          
          {/* 2. ADDED: Main wrapper with 'flex-grow' to push Footer down */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* 3. ADDED: The New Progress Route */}
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/subjects"
                element={
                  <ProtectedRoute>
                    <Subjects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subjects/:subject"
                element={
                  <ProtectedRoute>
                    <Subjects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/topics/:subject/:topic"
                element={
                  <ProtectedRoute>
                    <Topics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lesson/:subject/:topic/:lessonNumber"
                element={
                  <ProtectedRoute>
                    <Lesson />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:lessonId"
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch all - Redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;