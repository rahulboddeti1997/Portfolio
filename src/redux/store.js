import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productSlice';
import searchReducer from './searchSlice';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        search: searchReducer
    }
})