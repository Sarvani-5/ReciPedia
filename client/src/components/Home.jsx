import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecipes, setFilterCuisine } from '../redux/recipeSlice';
import RecipeCard from './RecipeCard';
import '../styles/Home.css';

function Home() {
  const dispatch = useDispatch();
  const { recipes, filterCuisine, loading, error } = useSelector((state) => state.recipes);

  const cuisines = ['All', 'Italian', 'Japanese', 'Healthy', 'Mexican', 'Indian'];

  useEffect(() => {
    dispatch(fetchRecipes(filterCuisine));
  }, [dispatch, filterCuisine]);

  const handleFilterChange = (cuisine) => {
    dispatch(setFilterCuisine(cuisine));
  };

  if (loading) {
    return (
      <div className="home">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>🍳 Loading recipes...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>❌ {error}</h2>
          <button onClick={() => dispatch(fetchRecipes(filterCuisine))}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="hero-section">
        <h1 className="hero-title">Discover & Share Amazing Recipes</h1>
      </div>

      <div className="filter-section">
        <div className="filter-container">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              className={`filter-btn ${filterCuisine === cuisine ? 'active' : ''}`}
              onClick={() => handleFilterChange(cuisine)}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      <div className="recipes-grid">
        {recipes.length === 0 ? (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
            <h2>No recipes found</h2>
            <p>Be the first to add a recipe!</p>
          </div>
        ) : (
          recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;