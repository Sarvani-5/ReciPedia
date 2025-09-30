import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { likeRecipeAsync } from '../redux/recipeSlice';
import '../styles/RecipeCard.css';

function RecipeCard({ recipe }) {
  const dispatch = useDispatch();

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(likeRecipeAsync(recipe._id));
  };

  return (
    <Link to={`/recipe/${recipe._id}`} className="recipe-card">
      <div className="card-image-container">
        <img src={recipe.image} alt={recipe.title} className="card-image" />
        <span className="difficulty-badge">{recipe.difficulty}</span>
      </div>
      <div className="card-content">
        <h3 className="card-title">{recipe.title}</h3>
        <div className="card-meta">
          <span className="cuisine-tag">{recipe.cuisine}</span>
          <span className="prep-time">⏱️ {recipe.prepTime}</span>
        </div>
        <div className="card-footer">
          <span className="author">By {recipe.author}</span>
          <button className="like-btn" onClick={handleLike}>
            ❤️ {recipe.likes}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;