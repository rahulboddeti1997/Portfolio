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
      const { id, variant, quantity = 1 } = action.payload;
      
      // Find the product in the products array
      const product = state.products.find(p => p.id === id);
      if (!product) return;
      
      // Create a unique identifier for variant-specific items
      const variantId = variant ? (variant.id || variant.variant_id || variant.size) : null;
      const cartItemId = variantId ? `${id}-${variantId}` : id;
      
      // Check if this specific variant is already in cart
      const existingItem = state.cartItems.find(item => 
        item.cartItemId === cartItemId
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const cartItem = {
          ...product,
          cartItemId,
          originalId: id,
          selectedVariant: variant,
          quantity: quantity,
          addedToCart: true
        };
        state.cartItems.push(cartItem);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      
      // Mark the base product as added to cart
      const productIndex = state.products.findIndex(p => p.id === id);
      if (productIndex !== -1) {
        state.products[productIndex].addedToCart = true;
      }
    },
    
    removeFromCart: (state, action) => {
      const { id, cartItemId } = action.payload;
      
      if (cartItemId) {
        // Remove specific variant
        state.cartItems = state.cartItems.filter(item => item.cartItemId !== cartItemId);
      } else {
        // Remove by product ID (legacy support)
        state.cartItems = state.cartItems.filter(item => item.originalId !== id && item.id !== id);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      
      // Check if any variants of this product are still in cart
      const productId = id || cartItemId?.split('-')[0];
      const hasVariantsInCart = state.cartItems.some(item => 
        item.originalId === productId || item.id === productId
      );
      
      // Only mark as not in cart if no variants remain
      if (!hasVariantsInCart) {
        const productIndex = state.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          state.products[productIndex].addedToCart = false;
        }
      }
    },
    
    updateQuantity: (state, action) => {
      const { id, cartItemId, quantity } = action.payload;
      
      const item = state.cartItems.find(item => 
        item.cartItemId === (cartItemId || id)
      );
      
      if (item && quantity > 0) {
        item.quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      } else if (item && quantity <= 0) {
        // Remove item if quantity is 0 or negative
        state.cartItems = state.cartItems.filter(item => 
          item.cartItemId !== (cartItemId || id)
        );
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        
        // Check if this was the last variant of the product
        const productId = item.originalId || item.id;
        const hasVariantsInCart = state.cartItems.some(cartItem => 
          cartItem.originalId === productId || cartItem.id === productId
        );
        
        if (!hasVariantsInCart) {
          const productIndex = state.products.findIndex(p => p.id === productId);
          if (productIndex !== -1) {
            state.products[productIndex].addedToCart = false;
          }
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
