// server.js
// This is the main entry point of our backend application.
// It sets up the Express server, connects to MongoDB,
// and registers all our routes.

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Create the Express application
const app = express();

// ==================== MIDDLEWARE ====================

// Allow JSON data in request body
app.use(express.json());

// Allow frontend (React) to communicate with backend
// During development, React runs on port 3000
// Backend runs on port 5000
// Without CORS, the browser blocks this communication
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// ==================== ROUTES ====================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/github', require('./routes/githubRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


// ==================== DEFAULT ROUTE ====================
app.get('/', (req, res) => {
  res.json({ 
    message: 'DevTrack AI Backend is running!',
    version: '1.0.0'
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});