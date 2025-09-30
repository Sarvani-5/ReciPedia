// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from './recipeSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    user: userReducer,
  },
});

export default store;