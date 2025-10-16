import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  cartItems: JSON.parse(localStorage.getItem('cartItems') || '[]'),
  wishlistItems: JSON.parse(localStorage.getItem('wishlistItems') || '[]'),
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...product, quantity: 1 });
      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      
      const productIndex = state.products.findIndex(p => p.id === product.id);
      if (productIndex !== -1) {
        state.products[productIndex].addedToCart = true;
      }
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== productId);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      
      const productIndex = state.products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        state.products[productIndex].addedToCart = false;
      }
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(item => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      } else if (item && quantity <= 0) {
        // Remove item if quantity is 0 or negative
        state.cartItems = state.cartItems.filter(item => item.id !== id);
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        
        const productIndex = state.products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
          state.products[productIndex].addedToCart = false;
        }
      }
    },
    
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.wishlistItems.find(item => item.id === product.id);
      
      if (!existingItem) {
        state.wishlistItems.push(product);
        localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
        
        const productIndex = state.products.findIndex(p => p.id === product.id);
        if (productIndex !== -1) {
          state.products[productIndex].wishListed = true;
        }
      }
    },
    
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.wishlistItems = state.wishlistItems.filter(item => item.id !== productId);
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
      
      const productIndex = state.products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        state.products[productIndex].wishListed = false;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.map(product => ({
          ...product,
          image: `/images/${product.id}.svg`,
          addedToCart: state.cartItems.some(item => item.id === product.id),
          wishListed: state.wishlistItems.some(item => item.id === product.id),
          price: product.variants?.[0]?.effective_price || product.base_price,
          mrp: product.base_price,
          discount: product.variants?.[0]?.discount_percentage || 0
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  addToWishlist,
  removeFromWishlist
} = productSlice.actions;

export default productSlice.reducer;
