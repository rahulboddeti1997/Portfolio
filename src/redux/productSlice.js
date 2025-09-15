import { createSlice } from '@reduxjs/toolkit'

const initialState = {
products : [
    {
      id: "1",
      name: "Printed White T-shirt",
      price: 600,
      mrp: 800,
      image: "/Portfolio/images/whiteTShirt.svg",
      discount: 25,
      savedForLater: false,
      addedToCart: false,
      wishListed: false,
      category: "1",
    },
    {
      id: "2",
      name: "Printed Black T-shirt",
      price: 700,
      mrp: 1000,
      image: "/Portfolio/images/blackTShirt.svg",
      discount: 30,
      savedForLater: false,
      addedToCart: false,
      wishListed: false,
      category: "1",
    },
    {
      id: "3",
      name: "Dark Blue T-shirt",
      price: 700,
      mrp: 1000,
      image: "/Portfolio/images/darkBlueTShirt.svg",
      discount: 30,
      savedForLater: false,
      addedToCart: false,
      wishListed: false,
      category: "1",
    },
    {
      id: "4",
      name: "Printed Blue T-shirt",
      price: 700,
      mrp: 1000,
      image: "/Portfolio/images/blueTShirt.svg",
      discount: 30,
      savedForLater: false,
      addedToCart: false,
      wishListed: false,
      category: "1",
    },
    {
      id: "5",
      name: "Printed Pink T-shirt",
      price: 700,
      mrp: 1000,
      image: "/Portfolio/images/pinkTShirt.svg",
      discount: 30,
      savedForLater: false,
      addedToCart: false,
      wishListed: false,
      category: "1",
    },
  ]
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.products.map(item => {
              if(item.id === action.payload.id) {
                item.addedToCart = true
              }
          });
        },
        removeFromCart: (state, action) => {
            state.products.map(item => {
              if(item.id === action.payload.id) {
                item.addedToCart = false
              }
          });
        },
        addToWishlist: (state, action) => {
            state.products.map(item => {
              if(item.id === action.payload.id) {
                item.wishListed = true
              }
          });
        },
        removeFromWishlist: (state, action) => {
            state.products.map(item => {
              if(item.id === action.payload.id) {
                item.wishListed = false
              }
          });
        }
    }
})

export const {addToCart, removeFromCart, addToWishlist, removeFromWishlist} = productsSlice.actions;
export default productsSlice.reducer;
