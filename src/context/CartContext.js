import React, { createContext, useState } from "react";

const CartContext = createContext();
const { Provider } = CartContext;

function CartProvider({ children, catalogs }) {
  const [savedItems, setSavedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Printed White T-shirt",
      price: 600,
      mrp: 800,
      image: "/whiteTShirt.svg",
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
      image: "/blackTShirt.svg",
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
      image: "/darkBlueTShirt.svg",
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
      image: "/blueTShirt.svg",
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
      image: "/pinkTShirt.svg",
      discount: 30,
      savedForLater: false,
      addedToCart: false,
      wishListed: false,
      category: "1",
    },
  ]);

  return (
    <Provider
      value={{
        savedItems,
        cartItems,
        setCartItems,
        setSavedItems,
        products,
        setProducts,
      }}
    >
      {children}
    </Provider>
  );
}

export { CartContext, CartProvider };
