const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Load environment variables
dotenv.config();

// 2. Connect to database
connectDB();

// 3. Initialize App
const app = express();

// 4. CORS Configuration (The Secure Setup)
const allowedOrigins = [
  "http://localhost:5173", // Local Frontend (Vite)
  "http://localhost:3000", // Local Frontend (React default)
  process.env.FRONTEND_URL // The Vercel URL (once deployed)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// 5. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 6. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

// Basic route for testing health
app.get('/', (req, res) => {
  res.json({
    message: 'AI Tutor API is running',
    version: '1.0.0',
  });
});

// 7. Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 404 Handler (for unknown routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// 8. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});