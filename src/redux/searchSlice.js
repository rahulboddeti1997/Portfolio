import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for autocomplete with caching
export const fetchAutocomplete = createAsyncThunk(
  'search/fetchAutocomplete',
  async (query, { rejectWithValue, getState }) => {
    try {
      if (!query || query.length < 3) { // Increased minimum length
        return { suggestions: [] };
      }

      // Check if we already have results for this query (simple caching)
      const state = getState();
      const cachedResult = state.search.autocompleteCache[query];
      if (cachedResult) {
        return cachedResult;
      }
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/autocomplete?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch autocomplete');
      }
      const data = await response.json();
      return { ...data, query }; // Include query for caching
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for search
export const fetchSearchResults = createAsyncThunk(
  'search/fetchSearchResults',
  async (query, { rejectWithValue }) => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    // Autocomplete state
    suggestions: [],
    autocompleteLoading: false,
    autocompleteError: null,
    autocompleteCache: {}, // Cache for autocomplete results
    
    // Search results state
    searchResults: null,
    searchLoading: false,
    searchError: null,
    currentQuery: '',
    
    // Search history
    searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
  },
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
      state.currentQuery = '';
      state.searchError = null;
    },
    setCurrentQuery: (state, action) => {
      state.currentQuery = action.payload;
    },
    addToSearchHistory: (state, action) => {
      const query = action.payload;
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory.unshift(query);
        state.searchHistory = state.searchHistory.slice(0, 10); // Keep only last 10
        localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory));
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
      localStorage.removeItem('searchHistory');
    },
    clearAutocompleteCache: (state) => {
      state.autocompleteCache = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Autocomplete cases
      .addCase(fetchAutocomplete.pending, (state) => {
        state.autocompleteLoading = true;
        state.autocompleteError = null;
      })
      .addCase(fetchAutocomplete.fulfilled, (state, action) => {
        state.autocompleteLoading = false;
        state.suggestions = action.payload.suggestions || [];
        
        // Cache the result if query is provided
        if (action.payload.query) {
          state.autocompleteCache[action.payload.query] = action.payload;
          
          // Limit cache size to prevent memory issues (keep last 20 queries)
          const cacheKeys = Object.keys(state.autocompleteCache);
          if (cacheKeys.length > 20) {
            const oldestKey = cacheKeys[0];
            delete state.autocompleteCache[oldestKey];
          }
        }
      })
      .addCase(fetchAutocomplete.rejected, (state, action) => {
        state.autocompleteLoading = false;
        state.autocompleteError = action.payload;
        state.suggestions = [];
      })
      
      // Search cases
      .addCase(fetchSearchResults.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });
  }
});

export const {
  clearSuggestions,
  clearSearchResults,
  setCurrentQuery,
  addToSearchHistory,
  clearSearchHistory,
  clearAutocompleteCache
} = searchSlice.actions;

export default searchSlice.reducer;