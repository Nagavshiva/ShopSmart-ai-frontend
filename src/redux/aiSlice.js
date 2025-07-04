import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from './api/axios'; 

// aiSlice.js
export const fetchAISearchSuggestions = createAsyncThunk(
  'ai/fetchSearchSuggestions',
  async (query, thunkAPI) => {
    try {
      const { data } = await axios.get(`/ai/search-suggestions`, {
        params: { query },
      });
      return {
        products: data.products || [],
        categories: data.categories || [],
        subcategories: data.subcategories || [],
        source: data.source || 'unknown'
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  products: [],
  categories: [],
  subcategories: [],
  loading: false,
  error: null,
  source: '',
  lastQuery: ''
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAISuggestions: (state) => {
      state.products = [];
      state.categories = [];
      state.subcategories = [];
      state.error = null;
      state.source = '';
      state.lastQuery = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAISearchSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAISearchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.categories = action.payload.categories;
        state.subcategories = action.payload.subcategories;
        state.source = action.payload.source;
        state.lastQuery = action.meta.arg;
      })
      .addCase(fetchAISearchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAISuggestions } = aiSlice.actions;
export default aiSlice.reducer;
