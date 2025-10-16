// Static product data for frontend deployment
// This matches the structure of your backend API response

export const staticProducts = [
  // WOMEN'S WESTERN WEAR - Dresses
  {
    id: 1,
    name: "Black Evening Dress",
    description: "Elegant black evening dress perfect for formal occasions and parties.",
    price: 2299,
    mrp: 2299,
    category: "western",
    color: "black",
    material: "polyester",
    occasion: "party",
    image_url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 8, discount_percentage: 0 },
      { size: "M", stock: 12, discount_percentage: 0 },
      { size: "L", stock: 6, discount_percentage: 0 },
      { size: "XL", stock: 4, discount_percentage: 0 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 2,
    name: "Red Floral Summer Dress",
    description: "Vibrant red floral dress perfect for summer outings and casual events.",
    price: 1279,
    mrp: 1599,
    category: "western",
    color: "red",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "XS", stock: 5, discount_percentage: 20 },
      { size: "S", stock: 15, discount_percentage: 20 },
      { size: "M", stock: 18, discount_percentage: 20 },
      { size: "L", stock: 10, discount_percentage: 20 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 3,
    name: "Blue Midi Dress",
    description: "Sophisticated blue midi dress suitable for office and semi-formal occasions.",
    price: 1899,
    mrp: 1899,
    category: "western",
    color: "blue",
    material: "viscose",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1566479179817-c03e51d1aecd?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 10, discount_percentage: 0 },
      { size: "M", stock: 15, discount_percentage: 0 },
      { size: "L", stock: 8, discount_percentage: 0 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 4,
    name: "White Cotton Top",
    description: "Classic white cotton top perfect for everyday wear and casual outings.",
    price: 799,
    mrp: 999,
    category: "western",
    color: "white",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "XS", stock: 12, discount_percentage: 20 },
      { size: "S", stock: 20, discount_percentage: 20 },
      { size: "M", stock: 25, discount_percentage: 20 },
      { size: "L", stock: 15, discount_percentage: 20 },
      { size: "XL", stock: 8, discount_percentage: 20 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 5,
    name: "Pink Crop Top",
    description: "Trendy pink crop top perfect for summer styling and casual wear.",
    price: 699,
    mrp: 899,
    category: "western",
    color: "pink",
    material: "cotton blend",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "XS", stock: 8, discount_percentage: 22 },
      { size: "S", stock: 15, discount_percentage: 22 },
      { size: "M", stock: 12, discount_percentage: 22 },
      { size: "L", stock: 7, discount_percentage: 22 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 6,
    name: "Denim Jacket",
    description: "Classic blue denim jacket for layering and casual styling.",
    price: 1899,
    mrp: 2399,
    category: "western",
    color: "blue",
    material: "denim",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 6, discount_percentage: 21 },
      { size: "M", stock: 10, discount_percentage: 21 },
      { size: "L", stock: 8, discount_percentage: 21 },
      { size: "XL", stock: 4, discount_percentage: 21 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 7,
    name: "Black Leather Jacket",
    description: "Stylish black leather jacket perfect for edgy and casual looks.",
    price: 3999,
    mrp: 4999,
    category: "western",
    color: "black",
    material: "leather",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 3, discount_percentage: 20 },
      { size: "M", stock: 5, discount_percentage: 20 },
      { size: "L", stock: 4, discount_percentage: 20 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 8,
    name: "Gray Cardigan",
    description: "Cozy gray cardigan perfect for layering during cooler weather.",
    price: 1299,
    mrp: 1599,
    category: "western",
    color: "gray",
    material: "wool blend",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1583391733855-d7931bc9e92b?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 8, discount_percentage: 19 },
      { size: "M", stock: 12, discount_percentage: 19 },
      { size: "L", stock: 6, discount_percentage: 19 },
      { size: "XL", stock: 4, discount_percentage: 19 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 9,
    name: "Blue High-Waist Jeans",
    description: "Classic blue high-waist jeans with a comfortable fit and timeless style.",
    price: 1799,
    mrp: 2199,
    category: "western",
    color: "blue",
    material: "denim",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1594736797933-d0a9c19b9504?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "26", stock: 6, discount_percentage: 18 },
      { size: "28", stock: 12, discount_percentage: 18 },
      { size: "30", stock: 15, discount_percentage: 18 },
      { size: "32", stock: 10, discount_percentage: 18 },
      { size: "34", stock: 5, discount_percentage: 18 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 10,
    name: "Black Skinny Jeans",
    description: "Sleek black skinny jeans perfect for both casual and semi-formal occasions.",
    price: 1599,
    mrp: 1999,
    category: "western",
    color: "black",
    material: "denim",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1583391733856-0d5e8bdc9c74?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "26", stock: 8, discount_percentage: 20 },
      { size: "28", stock: 15, discount_percentage: 20 },
      { size: "30", stock: 18, discount_percentage: 20 },
      { size: "32", stock: 12, discount_percentage: 20 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  // WOMEN'S ETHNIC WEAR
  {
    id: 11,
    name: "Red Traditional Saree",
    description: "Beautiful red traditional saree perfect for festivals and special occasions.",
    price: 2999,
    mrp: 3999,
    category: "ethnic",
    color: "red",
    material: "silk",
    occasion: "festival",
    image_url: "https://images.unsplash.com/photo-1583391733857-c4c5b0e5c8f2?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "Free Size", stock: 10, discount_percentage: 25 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 12,
    name: "Blue Anarkali Dress",
    description: "Elegant blue Anarkali dress with intricate embroidery work.",
    price: 2499,
    mrp: 3199,
    category: "ethnic",
    color: "blue",
    material: "georgette",
    occasion: "party",
    image_url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 5, discount_percentage: 22 },
      { size: "M", stock: 8, discount_percentage: 22 },
      { size: "L", stock: 6, discount_percentage: 22 },
      { size: "XL", stock: 3, discount_percentage: 22 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 13,
    name: "Pink Kurti Set",
    description: "Beautiful pink kurti with matching dupatta and palazzo set.",
    price: 1799,
    mrp: 2299,
    category: "ethnic",
    color: "pink",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 12, discount_percentage: 22 },
      { size: "M", stock: 18, discount_percentage: 22 },
      { size: "L", stock: 15, discount_percentage: 22 },
      { size: "XL", stock: 8, discount_percentage: 22 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 14,
    name: "Green Palazzo Set",
    description: "Comfortable green palazzo set perfect for everyday ethnic wear.",
    price: 1299,
    mrp: 1699,
    category: "ethnic",
    color: "green",
    material: "rayon",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 10, discount_percentage: 24 },
      { size: "M", stock: 15, discount_percentage: 24 },
      { size: "L", stock: 12, discount_percentage: 24 },
      { size: "XL", stock: 6, discount_percentage: 24 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 15,
    name: "Yellow Lehenga Choli",
    description: "Stunning yellow lehenga choli perfect for weddings and celebrations.",
    price: 4999,
    mrp: 6999,
    category: "ethnic",
    color: "yellow",
    material: "silk",
    occasion: "wedding",
    image_url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 3, discount_percentage: 29 },
      { size: "M", stock: 5, discount_percentage: 29 },
      { size: "L", stock: 4, discount_percentage: 29 },
      { size: "XL", stock: 2, discount_percentage: 29 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  // MEN'S WESTERN WEAR
  {
    id: 16,
    name: "White Formal Shirt",
    description: "Classic white formal shirt perfect for office and business meetings.",
    price: 1299,
    mrp: 1599,
    category: "western",
    color: "white",
    material: "cotton",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 15, discount_percentage: 19 },
      { size: "M", stock: 25, discount_percentage: 19 },
      { size: "L", stock: 20, discount_percentage: 19 },
      { size: "XL", stock: 12, discount_percentage: 19 },
      { size: "XXL", stock: 8, discount_percentage: 19 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 17,
    name: "Blue Casual T-Shirt",
    description: "Comfortable blue casual t-shirt perfect for everyday wear.",
    price: 699,
    mrp: 899,
    category: "western",
    color: "blue",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1583743814966-8936f37f73cd?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 20, discount_percentage: 22 },
      { size: "M", stock: 30, discount_percentage: 22 },
      { size: "L", stock: 25, discount_percentage: 22 },
      { size: "XL", stock: 15, discount_percentage: 22 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 18,
    name: "Black Chino Pants",
    description: "Stylish black chino pants suitable for both casual and semi-formal occasions.",
    price: 1599,
    mrp: 1999,
    category: "western",
    color: "black",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "30", stock: 8, discount_percentage: 20 },
      { size: "32", stock: 15, discount_percentage: 20 },
      { size: "34", stock: 18, discount_percentage: 20 },
      { size: "36", stock: 12, discount_percentage: 20 },
      { size: "38", stock: 6, discount_percentage: 20 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  // FOOTWEAR
  {
    id: 19,
    name: "Brown Leather Shoes",
    description: "Classic brown leather formal shoes perfect for office and business meetings.",
    price: 2999,
    mrp: 3999,
    category: "footwear",
    color: "brown",
    material: "leather",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "7", stock: 5, discount_percentage: 25 },
      { size: "8", stock: 8, discount_percentage: 25 },
      { size: "9", stock: 10, discount_percentage: 25 },
      { size: "10", stock: 6, discount_percentage: 25 },
      { size: "11", stock: 3, discount_percentage: 25 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  },
  {
    id: 20,
    name: "White Sneakers",
    description: "Comfortable white sneakers perfect for casual wear and sports activities.",
    price: 1999,
    mrp: 2499,
    category: "footwear",
    color: "white",
    material: "synthetic",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "6", stock: 8, discount_percentage: 20 },
      { size: "7", stock: 12, discount_percentage: 20 },
      { size: "8", stock: 15, discount_percentage: 20 },
      { size: "9", stock: 10, discount_percentage: 20 },
      { size: "10", stock: 6, discount_percentage: 20 }
    ],
    addedToCart: false,
    wishListed: false,
    quantity: 1
  }
];

export default staticProducts;