// server/api/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const recipeRoutes = require('../routes/recipes');

dotenv.config();

const app = express();

// ✅ SIMPLE FIX: Allow all origins (use for testing)
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (serverless-friendly)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    await connectDB();
    isConnected = true;
    console.log('✅ New database connection established');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
};

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Health check
app.get('/api', (req, res) => {
  res.json({ 
    message: '🍳 ReciPedia API is running!',
    status: 'Active',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/recipes', recipeRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.url
  });
});

// Export for Vercel
module.exports = app;