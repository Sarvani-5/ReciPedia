// src/components/RecipeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchRecipeById, 
  likeRecipeAsync, 
  deleteRecipeAsync, 
  updateRecipeAsync 
} from '../redux/recipeSlice';
import '../styles/RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get recipe from Redux store
  const { currentRecipe: recipe, loading, error } = useSelector((state) => state.recipes);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(null);

  // Fetch recipe when component mounts
  useEffect(() => {
    dispatch(fetchRecipeById(id));
  }, [dispatch, id]);

  // Loading state
  if (loading) {
    return (
      <div className="recipe-detail">
        <div style={{ 
          textAlign: 'center', 
          padding: '100px',
          fontSize: '24px'
        }}>
          <h2>🍳 Loading recipe...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="recipe-detail">
        <div style={{ 
          textAlign: 'center', 
          padding: '100px' 
        }}>
          <h2>❌ Error</h2>
          <p style={{ fontSize: '18px', marginTop: '20px' }}>{error}</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              marginTop: '30px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px'
            }}
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Recipe not found
  if (!recipe) {
    return (
      <div className="not-found" style={{ 
        textAlign: 'center', 
        padding: '100px' 
      }}>
        <h2>Recipe not found</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  // Handle like button click
  const handleLike = () => {
    dispatch(likeRecipeAsync(recipe._id));
  };

  // Handle delete button click
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await dispatch(deleteRecipeAsync(recipe._id));
      alert('✅ Recipe deleted successfully!');
      navigate('/');
    }
  };

  // Enter edit mode
  const handleEdit = () => {
    setEditedRecipe({
      ...recipe,
      ingredients: recipe.ingredients.join('\n'),
    });
    setIsEditing(true);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedRecipe(null);
  };

  // Save edited recipe
  const handleSaveEdit = async () => {
    const updatedRecipe = {
      ...editedRecipe,
      ingredients: editedRecipe.ingredients.split('\n').filter(i => i.trim() !== ''),
    };
    
    await dispatch(updateRecipeAsync({ id: recipe._id, data: updatedRecipe }));
    setIsEditing(false);
    setEditedRecipe(null);
    alert('✅ Recipe updated successfully!');
  };

  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Edit Mode View
  if (isEditing) {
    return (
      <div className="recipe-detail edit-mode">
        <div className="edit-header">
          <h1>Edit Recipe</h1>
        </div>
        
        <div className="edit-form">
          <div className="form-group span-2">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={editedRecipe.title}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              name="author"
              value={editedRecipe.author}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Cuisine</label>
            <select
              name="cuisine"
              value={editedRecipe.cuisine}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
              <option value="Mexican">Mexican</option>
              <option value="Indian">Indian</option>
              <option value="Healthy">Healthy</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Prep Time</label>
            <input
              type="text"
              name="prepTime"
              value={editedRecipe.prepTime}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select
              name="difficulty"
              value={editedRecipe.difficulty}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group span-2">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={editedRecipe.image}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group span-2">
            <label>Ingredients (one per line)</label>
            <textarea
              name="ingredients"
              value={editedRecipe.ingredients}
              onChange={handleInputChange}
              className="form-textarea"
              rows="6"
            />
          </div>

          <div className="form-group span-2">
            <label>Instructions</label>
            <textarea
              name="instructions"
              value={editedRecipe.instructions}
              onChange={handleInputChange}
              className="form-textarea"
              rows="6"
            />
          </div>

          <div className="edit-actions">
            <button className="save-btn" onClick={handleSaveEdit}>
              ✅ Save Changes
            </button>
            <button className="cancel-btn" onClick={handleCancelEdit}>
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal Detail View
  return (
    <div className="recipe-detail">
      <div className="detail-header">
        <img src={recipe.image} alt={recipe.title} className="detail-image" />
        <div className="header-overlay">
          <div className="header-content">
            <h1 className="detail-title">{recipe.title}</h1>
            <div className="detail-meta">
              <span className="meta-item">👨‍🍳 {recipe.author}</span>
              <span className="meta-item">🍽️ {recipe.cuisine}</span>
              <span className="meta-item">⏱️ {recipe.prepTime}</span>
              <span className="meta-item difficulty-tag">{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-section">
          <h2 className="section-title">Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="detail-section">
          <h2 className="section-title">Instructions</h2>
          <p className="instructions-text">{recipe.instructions}</p>
        </div>

        <div className="detail-actions">
          <button className="action-btn like-action" onClick={handleLike}>
            ❤️ Like ({recipe.likes})
          </button>
          <button className="action-btn edit-action" onClick={handleEdit}>
            ✏️ Edit
          </button>
          <button className="action-btn delete-action" onClick={handleDelete}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;