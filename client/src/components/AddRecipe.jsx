// src/components/AddRecipe.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createRecipe } from '../redux/recipeSlice'; // FIXED: Changed from addRecipe
import '../styles/AddRecipe.css';

function AddRecipe() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const { loading, error } = useSelector((state) => state.recipes);

  const [formData, setFormData] = useState({
    title: '',
    cuisine: 'Italian',
    prepTime: '',
    difficulty: 'Easy',
    image: '',
    ingredients: '',
    instructions: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newRecipe = {
      ...formData,
      author: user.name,
      ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
    };

    const result = await dispatch(createRecipe(newRecipe));
    
    if (result.type === 'recipes/createRecipe/fulfilled') {
      alert('✅ Recipe created successfully!');
      navigate('/');
    }
  };

  return (
    <div className="add-recipe">
      <div className="form-container">
        <h1 className="form-title">Share Your Recipe</h1>
        
        {error && (
          <div style={{
            background: '#fee',
            color: '#c00',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-group span-2">
            <label className="form-label">Recipe Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Grandma's Secret Pasta"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Prep Time *</label>
            <input
              type="text"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., 30 mins"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cuisine Type *</label>
            <select
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option>Italian</option>
              <option>Japanese</option>
              <option>Mexican</option>
              <option>Indian</option>
              <option>Healthy</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty *</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="form-group span-2">
            <label className="form-label">Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="form-group span-2">
            <label className="form-label">Ingredients (one per line) *</label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              className="form-textarea"
              placeholder="2 cups flour&#10;1 cup sugar&#10;3 eggs"
              rows="6"
              required
            />
          </div>

          <div className="form-group span-2">
            <label className="form-label">Instructions *</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describe the cooking process step by step..."
              rows="6"
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '⏳ Publishing...' : '🚀 Publish Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRecipe;