import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient, { cachedGet } from '@/services/apiClient';

// ─────────────────────────────────────────────────────────────────────────────
// REDUX-LEVEL CACHE CONFIG
// Selectors first check Redux state (in-memory).
// If stale or missing, cachedGet() checks sessionStorage before hitting network.
// This means:
//   - Same tab re-navigation: instant (Redux)
//   - New tab / page refresh: fast (sessionStorage)
//   - Stale / first ever load: network (with deduplication)
// ─────────────────────────────────────────────────────────────────────────────

const REDUX_TTL_MS = 5 * 60 * 1000; // 5 minutes in Redux state

function isStale(cachedAt) {
  if (!cachedAt) return true;
  return Date.now() - cachedAt > REDUX_TTL_MS;
}

// ── Async Thunks ──────────────────────────────────────────────────────────────

/**
 * fetchProducts — fetches all products with memoization.
 * Returns immediately if Redux state is fresh (< 5 min old).
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ category, search } = {}, { getState, rejectWithValue }) => {
    // Check Redux state freshness first
    const { products } = getState();
    if (
      !search && (!category || category === 'All') &&
      products.items.length > 0 &&
      !isStale(products.fetchedAt)
    ) {
      return { cached: true, items: products.items };
    }

    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      const url = `/products?${params.toString()}`;
      const data = await cachedGet(url);
      return { cached: false, items: Array.isArray(data) ? data : (data?.products || []) };
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch products');
    }
  }
);

/**
 * fetchProductById — fetches a single product with memoization.
 * Priority order:
 *   1. Redux selectedProduct (same product ID, fresh)
 *   2. Redux items cache (product already in list)
 *   3. sessionStorage via cachedGet()
 *   4. Network (only if all above miss)
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, { getState, rejectWithValue }) => {
    const { products } = getState();

    // Layer 1: Already selected + fresh in Redux
    const selected = products.selectedProduct;
    if (
      selected &&
      (selected._id === productId || selected.id === productId) &&
      !isStale(products.selectedProductFetchedAt)
    ) {
      return { cached: true, product: selected };
    }

    // Layer 2: Already in Redux items list
    const fromList = products.items.find(
      p => p._id === productId || p.id === productId
    );
    if (fromList && !isStale(products.fetchedAt)) {
      return { cached: true, product: fromList };
    }

    // Layer 3 + 4: cachedGet() checks sessionStorage then network
    try {
      const data = await cachedGet(`/products/${productId}`);
      return { cached: false, product: data };
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
    fetchedAt: null,             // timestamp — controls Redux-level stale check
    selectedProduct: null,
    selectedProductFetchedAt: null,
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
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
      state.selectedProductFetchedAt = Date.now();
    },
    clearError: (state) => { state.error = null; },
    /** Call this after a mutation (e.g. form submit) to force re-fetch */
    invalidateProductCache: (state) => {
      state.fetchedAt = null;
      state.selectedProductFetchedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchProducts ──────────────────────────────────────────────────────
      .addCase(fetchProducts.pending, (state) => {
        // Only show loading spinner on genuine network fetches (not cache hits)
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cached) {
          state.items = action.payload.items;
          state.fetchedAt = Date.now();
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── fetchProductById ───────────────────────────────────────────────────
      .addCase(fetchProductById.pending, (state) => {
        state.error = null;
        // Do NOT set loading=true if we already have selectedProduct (avoid flicker)
        if (!state.selectedProduct) {
          state.loading = true;
        }
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cached) {
          state.selectedProduct = action.payload.product;
          state.selectedProductFetchedAt = Date.now();
        } else if (!state.selectedProduct) {
          // Promote from list cache to selectedProduct
          state.selectedProduct = action.payload.product;
          state.selectedProductFetchedAt = Date.now();
        }
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
  invalidateProductCache,
} = productsSlice.actions;

export default productsSlice.reducer;
