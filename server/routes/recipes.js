const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// @route   POST /api/recipes
// @desc    Create a new recipe
// @access  Public
router.post('/', async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({
      success: true,
      data: recipe,
      message: 'Recipe created successfully'
    });
  } catch (error) {
    console.error('Create Recipe Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating recipe'
    });
  }
});

// @route   GET /api/recipes
// @desc    Get all recipes with optional cuisine filter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { cuisine } = req.query;
    let filter = {};
    
    if (cuisine && cuisine !== 'All') {
      filter.cuisine = cuisine;
    }

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Fetch Recipes Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes'
    });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Fetch Recipe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe'
    });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Update a recipe
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      data: recipe,
      message: 'Recipe updated successfully'
    });
  } catch (error) {
    console.error('Update Recipe Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating recipe'
    });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete a recipe
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      data: {},
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Delete Recipe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting recipe'
    });
  }
});

// @route   PATCH /api/recipes/:id/like
// @desc    Like a recipe (increment likes)
// @access  Public
router.patch('/:id/like', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      data: recipe,
      message: 'Recipe liked successfully'
    });
  } catch (error) {
    console.error('Like Recipe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking recipe'
    });
  }
});

module.exports = router;