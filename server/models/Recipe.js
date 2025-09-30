const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  cuisine: {
    type: String,
    required: [true, 'Please add cuisine type'],
    enum: ['Italian', 'Japanese', 'Mexican', 'Indian', 'Healthy', 'Other']
  },
  prepTime: {
    type: String,
    required: [true, 'Please add prep time']
  },
  difficulty: {
    type: String,
    required: [true, 'Please add difficulty level'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: {
    type: String,
    required: [true, 'Please add instructions']
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Recipe', recipeSchema);