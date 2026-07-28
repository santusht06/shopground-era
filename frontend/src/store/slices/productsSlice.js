import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/services/apiClient';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ category, search } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      const res = await apiClient.get(`/products?${params.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/products/${productId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Product not found');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProduct: null,
    searchQuery: '',
    selectedCategory: 'All',
    sortBy: 'featured',
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    setSelectedCategory: (state, action) => { state.selectedCategory = action.payload; },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    setSelectedProduct: (state, action) => { state.selectedProduct = action.payload; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setSelectedProduct,
  clearError,
} = productsSlice.actions;

export default productsSlice.reducer;
