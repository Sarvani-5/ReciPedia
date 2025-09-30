//src/recipeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ FIXED: Use the correct backend URL from Image 2
const BASE_URL = process.env.REACT_APP_API_URL || 'https://recipedia-server-cyan.vercel.app';
const API_URL = `${BASE_URL}/api/recipes`;

console.log('🔗 Connecting to API:', API_URL);

// CREATE - Add new recipe
export const createRecipe = createAsyncThunk(
  'recipes/createRecipe',
  async (recipeData, { rejectWithValue }) => {
    try {
      console.log('Creating recipe:', recipeData);
      const response = await axios.post(API_URL, recipeData);
      return response.data.data;
    } catch (error) {
      console.error('❌ Create Recipe Error:', error.response || error);
      return rejectWithValue(error.response?.data?.message || 'Error creating recipe');
    }
  }
);

// READ - Fetch all recipes
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (cuisine = 'All', { rejectWithValue }) => {
    try {
      const url = cuisine === 'All' ? API_URL : `${API_URL}?cuisine=${cuisine}`;
      console.log('📡 Fetching recipes from:', url);
      const response = await axios.get(url);
      console.log('✅ Recipes fetched:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Fetch Recipes Error:', error.response || error);
      return rejectWithValue(error.response?.data?.message || 'Error fetching recipes');
    }
  }
);

// READ - Fetch single recipe
export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('❌ Fetch Recipe Error:', error.response || error);
      return rejectWithValue(error.response?.data?.message || 'Error fetching recipe');
    }
  }
);

// UPDATE - Update recipe
export const updateRecipeAsync = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Update Recipe Error:', error.response || error);
      return rejectWithValue(error.response?.data?.message || 'Error updating recipe');
    }
  }
);

// DELETE - Delete recipe
export const deleteRecipeAsync = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      console.error('❌ Delete Recipe Error:', error.response || error);
      return rejectWithValue(error.response?.data?.message || 'Error deleting recipe');
    }
  }
);

// UPDATE - Like recipe
export const likeRecipeAsync = createAsyncThunk(
  'recipes/likeRecipe',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/like`);
      return response.data.data;
    } catch (error) {
      console.error('❌ Like Recipe Error:', error.response || error);
      return rejectWithValue(error.response?.data?.message || 'Error liking recipe');
    }
  }
);

const initialState = {
  recipes: [],
  currentRecipe: null,
  filterCuisine: 'All',
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setFilterCuisine: (state, action) => {
      state.filterCuisine = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single recipe
      .addCase(fetchRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create recipe
      .addCase(createRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes.unshift(action.payload);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update recipe
      .addCase(updateRecipeAsync.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
        state.currentRecipe = action.payload;
      })
      
      // Delete recipe
      .addCase(deleteRecipeAsync.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(r => r._id !== action.payload);
      })
      
      // Like recipe
      .addCase(likeRecipeAsync.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
        if (state.currentRecipe && state.currentRecipe._id === action.payload._id) {
          state.currentRecipe = action.payload;
        }
      });
  },
});

export const { setFilterCuisine, clearError } = recipeSlice.actions;
export default recipeSlice.reducer;