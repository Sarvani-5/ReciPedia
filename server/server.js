const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

// Import connectDB AFTER dotenv
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ADD THIS: Import and use recipe routes
const recipeRoutes = require('./routes/recipes');
app.use('/api/recipes', recipeRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '🍳 ReciPedia API is running!',
    status: 'Active',
    database: 'MongoDB Atlas',
    endpoints: {
      recipes: '/api/recipes',
      createRecipe: 'POST /api/recipes',
      getRecipe: 'GET /api/recipes/:id',
      updateRecipe: 'PUT /api/recipes/:id',
      deleteRecipe: 'DELETE /api/recipes/:id',
      likeRecipe: 'PATCH /api/recipes/:id/like'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
  console.log(`📋 Recipes API: http://localhost:${PORT}/api/recipes`);
});