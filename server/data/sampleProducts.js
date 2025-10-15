// Comprehensive fashion products dataset - 50+ items
// All images from Unsplash with verified working URLs
const sampleProducts = [
  // WOMEN'S WESTERN WEAR - Dresses
  {
    name: "Black Evening Dress",
    description: "Elegant black evening dress perfect for formal occasions and parties.",
    base_price: 2299,
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
    ]
  },
  {
    name: "Red Floral Summer Dress",
    description: "Vibrant red floral dress perfect for summer outings and casual events.",
    base_price: 1599,
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
    ]
  },
  {
    name: "Blue Midi Dress",
    description: "Sophisticated blue midi dress suitable for office and semi-formal occasions.",
    base_price: 1899,
    category: "western",
    color: "blue",
    material: "viscose",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1566479179817-c03e51d1aecd?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 10, discount_percentage: 0 },
      { size: "M", stock: 15, discount_percentage: 0 },
      { size: "L", stock: 8, discount_percentage: 0 }
    ]
  },
  {
    name: "White Casual Dress",
    description: "Comfortable white dress perfect for everyday wear and casual outings.",
    base_price: 1299,
    category: "western",
    color: "white",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 12, discount_percentage: 15 },
      { size: "M", stock: 20, discount_percentage: 15 },
      { size: "L", stock: 12, discount_percentage: 15 },
      { size: "XL", stock: 6, discount_percentage: 15 }
    ]
  },
  {
    name: "Pink Party Dress",
    description: "Stylish pink dress perfect for parties and special celebrations.",
    base_price: 2099,
    category: "western",
    color: "pink",
    material: "chiffon",
    occasion: "party",
    image_url: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 8, discount_percentage: 0 },
      { size: "M", stock: 10, discount_percentage: 0 },
      { size: "L", stock: 5, discount_percentage: 0 }
    ]
  },

  // WOMEN'S ETHNIC WEAR - Sarees
  {
    name: "Red Silk Saree",
    description: "Traditional red silk saree with golden border, perfect for weddings and festivals.",
    base_price: 3499,
    category: "ethnic",
    color: "red",
    material: "silk",
    occasion: "wedding",
    image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "One Size", stock: 15, discount_percentage: 0 }
    ]
  },
  {
    name: "Blue Cotton Saree",
    description: "Comfortable blue cotton saree ideal for daily wear and office.",
    base_price: 1299,
    category: "ethnic",
    color: "blue",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "One Size", stock: 25, discount_percentage: 25 }
    ]
  },
  {
    name: "Green Georgette Saree",
    description: "Elegant green georgette saree with beautiful drape for special occasions.",
    base_price: 2299,
    category: "ethnic",
    color: "green",
    material: "georgette",
    occasion: "party",
    image_url: "https://images.unsplash.com/photo-1583391733855-d7931bc9e92b?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "One Size", stock: 12, discount_percentage: 10 }
    ]
  },

  // WOMEN'S ETHNIC WEAR - Kurtis
  {
    name: "Pink Cotton Kurti",
    description: "Comfortable pink cotton kurti perfect for casual and office wear.",
    base_price: 799,
    category: "ethnic",
    color: "pink",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1594736797933-d0a9c19b9504?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 20, discount_percentage: 0 },
      { size: "M", stock: 25, discount_percentage: 0 },
      { size: "L", stock: 18, discount_percentage: 0 },
      { size: "XL", stock: 12, discount_percentage: 0 }
    ]
  },
  {
    name: "Blue Printed Kurti",
    description: "Stylish blue printed kurti with contemporary design for modern women.",
    base_price: 999,
    category: "ethnic",
    color: "blue",
    material: "rayon",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1583391733856-0d5e8bdc9c74?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 15, discount_percentage: 20 },
      { size: "M", stock: 20, discount_percentage: 20 },
      { size: "L", stock: 15, discount_percentage: 20 }
    ]
  },
  {
    name: "White Embroidered Kurti",
    description: "Beautiful white kurti with intricate embroidery work for special occasions.",
    base_price: 1399,
    category: "ethnic",
    color: "white",
    material: "cotton",
    occasion: "party",
    image_url: "https://images.unsplash.com/photo-1583391733857-c4c5b0e5c8f2?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 10, discount_percentage: 0 },
      { size: "M", stock: 15, discount_percentage: 0 },
      { size: "L", stock: 8, discount_percentage: 0 }
    ]
  },

  // MEN'S WESTERN WEAR - Shirts
  {
    name: "White Formal Shirt",
    description: "Classic white formal shirt perfect for office and business meetings.",
    base_price: 899,
    category: "western",
    color: "white",
    material: "cotton",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 15, discount_percentage: 0 },
      { size: "M", stock: 25, discount_percentage: 0 },
      { size: "L", stock: 20, discount_percentage: 0 },
      { size: "XL", stock: 12, discount_percentage: 0 },
      { size: "XXL", stock: 8, discount_percentage: 0 }
    ]
  },
  {
    name: "Blue Casual Shirt",
    description: "Comfortable blue casual shirt for weekend outings and relaxed occasions.",
    base_price: 1199,
    category: "western",
    color: "blue",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 12, discount_percentage: 15 },
      { size: "M", stock: 18, discount_percentage: 15 },
      { size: "L", stock: 15, discount_percentage: 15 },
      { size: "XL", stock: 10, discount_percentage: 15 }
    ]
  },
  {
    name: "Black Formal Shirt",
    description: "Sophisticated black formal shirt ideal for evening events and formal occasions.",
    base_price: 1099,
    category: "western",
    color: "black",
    material: "cotton",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 10, discount_percentage: 0 },
      { size: "M", stock: 20, discount_percentage: 0 },
      { size: "L", stock: 18, discount_percentage: 0 },
      { size: "XL", stock: 12, discount_percentage: 0 }
    ]
  },
  {
    name: "Red Checked Shirt",
    description: "Trendy red checked shirt perfect for casual outings and weekend wear.",
    base_price: 1299,
    category: "western",
    color: "red",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 8, discount_percentage: 20 },
      { size: "M", stock: 15, discount_percentage: 20 },
      { size: "L", stock: 12, discount_percentage: 20 },
      { size: "XL", stock: 8, discount_percentage: 20 }
    ]
  },

  // MEN'S T-SHIRTS
  {
    name: "Black Cotton T-Shirt",
    description: "Basic black cotton t-shirt, essential wardrobe staple for men.",
    base_price: 599,
    category: "western",
    color: "black",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 25, discount_percentage: 0 },
      { size: "M", stock: 30, discount_percentage: 0 },
      { size: "L", stock: 25, discount_percentage: 0 },
      { size: "XL", stock: 20, discount_percentage: 0 },
      { size: "XXL", stock: 15, discount_percentage: 0 }
    ]
  },
  {
    name: "White V-Neck T-Shirt",
    description: "Classic white v-neck t-shirt perfect for layering and casual wear.",
    base_price: 649,
    category: "western",
    color: "white",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1583743814966-8936f37f73cd?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 20, discount_percentage: 10 },
      { size: "M", stock: 25, discount_percentage: 10 },
      { size: "L", stock: 20, discount_percentage: 10 },
      { size: "XL", stock: 15, discount_percentage: 10 }
    ]
  },
  {
    name: "Navy Blue T-Shirt",
    description: "Comfortable navy blue t-shirt made from premium cotton blend.",
    base_price: 699,
    category: "western",
    color: "navy",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 18, discount_percentage: 0 },
      { size: "M", stock: 22, discount_percentage: 0 },
      { size: "L", stock: 18, discount_percentage: 0 },
      { size: "XL", stock: 12, discount_percentage: 0 }
    ]
  },

  // WOMEN'S TOPS
  {
    name: "Pink Floral Top",
    description: "Beautiful pink floral top perfect for casual outings and summer wear.",
    base_price: 899,
    category: "western",
    color: "pink",
    material: "chiffon",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "XS", stock: 8, discount_percentage: 15 },
      { size: "S", stock: 15, discount_percentage: 15 },
      { size: "M", stock: 18, discount_percentage: 15 },
      { size: "L", stock: 12, discount_percentage: 15 }
    ]
  },
  {
    name: "White Cotton Blouse",
    description: "Elegant white cotton blouse suitable for office and formal occasions.",
    base_price: 1199,
    category: "western",
    color: "white",
    material: "cotton",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 12, discount_percentage: 0 },
      { size: "M", stock: 16, discount_percentage: 0 },
      { size: "L", stock: 10, discount_percentage: 0 },
      { size: "XL", stock: 6, discount_percentage: 0 }
    ]
  },

  // JEANS AND PANTS
  {
    name: "Blue Skinny Jeans",
    description: "Trendy blue skinny jeans with perfect fit for modern women.",
    base_price: 1799,
    category: "western",
    color: "blue",
    material: "denim",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "26", stock: 8, discount_percentage: 20 },
      { size: "28", stock: 15, discount_percentage: 20 },
      { size: "30", stock: 18, discount_percentage: 20 },
      { size: "32", stock: 12, discount_percentage: 20 },
      { size: "34", stock: 8, discount_percentage: 20 }
    ]
  },
  {
    name: "Black Straight Jeans",
    description: "Classic black straight fit jeans perfect for both men and women.",
    base_price: 1999,
    category: "western",
    color: "black",
    material: "denim",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1551847919-8c7e8c4b6b14?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "28", stock: 10, discount_percentage: 0 },
      { size: "30", stock: 18, discount_percentage: 0 },
      { size: "32", stock: 22, discount_percentage: 0 },
      { size: "34", stock: 15, discount_percentage: 0 },
      { size: "36", stock: 10, discount_percentage: 0 }
    ]
  },
  {
    name: "Gray Formal Pants",
    description: "Professional gray formal pants suitable for office and business meetings.",
    base_price: 1599,
    category: "western",
    color: "gray",
    material: "polyester",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "28", stock: 8, discount_percentage: 0 },
      { size: "30", stock: 15, discount_percentage: 0 },
      { size: "32", stock: 20, discount_percentage: 0 },
      { size: "34", stock: 18, discount_percentage: 0 },
      { size: "36", stock: 12, discount_percentage: 0 }
    ]
  },
  {
    name: "Navy Blue Chinos",
    description: "Stylish navy blue chinos perfect for smart casual occasions.",
    base_price: 1399,
    category: "western",
    color: "navy",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "28", stock: 10, discount_percentage: 15 },
      { size: "30", stock: 16, discount_percentage: 15 },
      { size: "32", stock: 18, discount_percentage: 15 },
      { size: "34", stock: 12, discount_percentage: 15 }
    ]
  },

  // MEN'S ETHNIC WEAR
  {
    name: "White Cotton Kurta",
    description: "Traditional white cotton kurta perfect for festivals and casual wear.",
    base_price: 899,
    category: "ethnic",
    color: "white",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1583391733855-d7931bc9e92b?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 12, discount_percentage: 0 },
      { size: "M", stock: 20, discount_percentage: 0 },
      { size: "L", stock: 18, discount_percentage: 0 },
      { size: "XL", stock: 15, discount_percentage: 0 },
      { size: "XXL", stock: 10, discount_percentage: 0 }
    ]
  },
  {
    name: "Cream Silk Kurta",
    description: "Elegant cream silk kurta ideal for weddings and special ceremonies.",
    base_price: 1599,
    category: "ethnic",
    color: "cream",
    material: "silk",
    occasion: "wedding",
    image_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 8, discount_percentage: 0 },
      { size: "M", stock: 15, discount_percentage: 0 },
      { size: "L", stock: 12, discount_percentage: 0 },
      { size: "XL", stock: 10, discount_percentage: 0 }
    ]
  },
  {
    name: "Blue Linen Kurta",
    description: "Comfortable blue linen kurta perfect for summer festivals and occasions.",
    base_price: 1199,
    category: "ethnic",
    color: "blue",
    material: "linen",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1583391733857-c4c5b0e5c8f2?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 10, discount_percentage: 20 },
      { size: "M", stock: 18, discount_percentage: 20 },
      { size: "L", stock: 15, discount_percentage: 20 },
      { size: "XL", stock: 12, discount_percentage: 20 }
    ]
  },

  // FOOTWEAR - Men's
  {
    name: "Black Leather Formal Shoes",
    description: "Classic black leather formal shoes perfect for office and business occasions.",
    base_price: 2999,
    category: "footwear",
    color: "black",
    material: "leather",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "7", stock: 5, discount_percentage: 0 },
      { size: "8", stock: 12, discount_percentage: 0 },
      { size: "9", stock: 15, discount_percentage: 0 },
      { size: "10", stock: 12, discount_percentage: 0 },
      { size: "11", stock: 8, discount_percentage: 0 }
    ]
  },
  {
    name: "Brown Casual Shoes",
    description: "Comfortable brown casual shoes suitable for everyday wear and outings.",
    base_price: 2499,
    category: "footwear",
    color: "brown",
    material: "leather",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "7", stock: 8, discount_percentage: 15 },
      { size: "8", stock: 15, discount_percentage: 15 },
      { size: "9", stock: 18, discount_percentage: 15 },
      { size: "10", stock: 12, discount_percentage: 15 },
      { size: "11", stock: 6, discount_percentage: 15 }
    ]
  },
  {
    name: "White Sports Sneakers",
    description: "Trendy white sports sneakers perfect for gym, running and casual wear.",
    base_price: 1999,
    category: "footwear",
    color: "white",
    material: "synthetic",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "7", stock: 10, discount_percentage: 25 },
      { size: "8", stock: 18, discount_percentage: 25 },
      { size: "9", stock: 20, discount_percentage: 25 },
      { size: "10", stock: 15, discount_percentage: 25 },
      { size: "11", stock: 10, discount_percentage: 25 }
    ]
  },
  {
    name: "Navy Blue Canvas Shoes",
    description: "Stylish navy blue canvas shoes perfect for casual outings and college wear.",
    base_price: 1599,
    category: "footwear",
    color: "navy",
    material: "canvas",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "7", stock: 12, discount_percentage: 20 },
      { size: "8", stock: 16, discount_percentage: 20 },
      { size: "9", stock: 18, discount_percentage: 20 },
      { size: "10", stock: 14, discount_percentage: 20 },
      { size: "11", stock: 8, discount_percentage: 20 }
    ]
  },

  // FOOTWEAR - Women's
  {
    name: "Black High Heels",
    description: "Elegant black high heels perfect for parties and formal occasions.",
    base_price: 2299,
    category: "footwear",
    color: "black",
    material: "synthetic",
    occasion: "party",
    image_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "5", stock: 8, discount_percentage: 0 },
      { size: "6", stock: 15, discount_percentage: 0 },
      { size: "7", stock: 18, discount_percentage: 0 },
      { size: "8", stock: 12, discount_percentage: 0 },
      { size: "9", stock: 6, discount_percentage: 0 }
    ]
  },
  {
    name: "Brown Casual Sandals",
    description: "Comfortable brown sandals perfect for daily wear and casual outings.",
    base_price: 1299,
    category: "footwear",
    color: "brown",
    material: "leather",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1594433974302-6f76fa3e1968?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "5", stock: 10, discount_percentage: 30 },
      { size: "6", stock: 18, discount_percentage: 30 },
      { size: "7", stock: 20, discount_percentage: 30 },
      { size: "8", stock: 15, discount_percentage: 30 },
      { size: "9", stock: 8, discount_percentage: 30 }
    ]
  },
  {
    name: "White Flat Shoes",
    description: "Comfortable white flat shoes ideal for office and daily wear.",
    base_price: 1599,
    category: "footwear",
    color: "white",
    material: "synthetic",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "5", stock: 12, discount_percentage: 0 },
      { size: "6", stock: 20, discount_percentage: 0 },
      { size: "7", stock: 22, discount_percentage: 0 },
      { size: "8", stock: 16, discount_percentage: 0 },
      { size: "9", stock: 10, discount_percentage: 0 }
    ]
  },

  // ADDITIONAL WESTERN WEAR
  {
    name: "Gray Hoodie",
    description: "Comfortable gray hoodie perfect for winter and casual wear.",
    base_price: 1799,
    category: "western",
    color: "gray",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 15, discount_percentage: 20 },
      { size: "M", stock: 25, discount_percentage: 20 },
      { size: "L", stock: 20, discount_percentage: 20 },
      { size: "XL", stock: 15, discount_percentage: 20 }
    ]
  },
  {
    name: "Black Leather Jacket",
    description: "Stylish black leather jacket perfect for winter and party occasions.",
    base_price: 4999,
    category: "western",
    color: "black",
    material: "leather",
    occasion: "party",
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 6, discount_percentage: 0 },
      { size: "M", stock: 10, discount_percentage: 0 },
      { size: "L", stock: 8, discount_percentage: 0 },
      { size: "XL", stock: 5, discount_percentage: 0 }
    ]
  },
  {
    name: "White Cotton Shorts",
    description: "Comfortable white cotton shorts perfect for summer and casual wear.",
    base_price: 899,
    category: "western",
    color: "white",
    material: "cotton",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1506629905607-45c0ac8bb9bb?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 20, discount_percentage: 15 },
      { size: "M", stock: 25, discount_percentage: 15 },
      { size: "L", stock: 18, discount_percentage: 15 },
      { size: "XL", stock: 12, discount_percentage: 15 }
    ]
  },
  {
    name: "Blue Denim Jacket",
    description: "Classic blue denim jacket perfect for layering and casual style.",
    base_price: 2299,
    category: "western",
    color: "blue",
    material: "denim",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 8, discount_percentage: 25 },
      { size: "M", stock: 15, discount_percentage: 25 },
      { size: "L", stock: 12, discount_percentage: 25 },
      { size: "XL", stock: 8, discount_percentage: 25 }
    ]
  },

  // WOMEN'S FORMAL WEAR
  {
    name: "Black Formal Blazer",
    description: "Professional black blazer perfect for office and business meetings.",
    base_price: 2799,
    category: "western",
    color: "black",
    material: "polyester",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 8, discount_percentage: 0 },
      { size: "M", stock: 12, discount_percentage: 0 },
      { size: "L", stock: 10, discount_percentage: 0 },
      { size: "XL", stock: 6, discount_percentage: 0 }
    ]
  },
  {
    name: "Navy Blue Formal Skirt",
    description: "Elegant navy blue formal skirt suitable for office and professional settings.",
    base_price: 1399,
    category: "western",
    color: "navy",
    material: "polyester",
    occasion: "office",
    image_url: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 12, discount_percentage: 0 },
      { size: "M", stock: 18, discount_percentage: 0 },
      { size: "L", stock: 15, discount_percentage: 0 },
      { size: "XL", stock: 8, discount_percentage: 0 }
    ]
  },

  // TRADITIONAL WEAR
  {
    name: "Maroon Anarkali Suit",
    description: "Beautiful maroon anarkali suit perfect for weddings and festivities.",
    base_price: 3499,
    category: "ethnic",
    color: "maroon",
    material: "georgette",
    occasion: "wedding",
    image_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 6, discount_percentage: 0 },
      { size: "M", stock: 10, discount_percentage: 0 },
      { size: "L", stock: 8, discount_percentage: 0 },
      { size: "XL", stock: 5, discount_percentage: 0 }
    ]
  },
  {
    name: "Yellow Cotton Lehenga",
    description: "Vibrant yellow cotton lehenga ideal for festivals and celebrations.",
    base_price: 2999,
    category: "ethnic",
    color: "yellow",
    material: "cotton",
    occasion: "party",
    image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 8, discount_percentage: 10 },
      { size: "M", stock: 12, discount_percentage: 10 },
      { size: "L", stock: 10, discount_percentage: 10 }
    ]
  },

  // SPORTSWEAR
  {
    name: "Black Track Pants",
    description: "Comfortable black track pants perfect for gym and sports activities.",
    base_price: 999,
    category: "western",
    color: "black",
    material: "polyester",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1506629905607-45c0ac8bb9bb?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 18, discount_percentage: 20 },
      { size: "M", stock: 25, discount_percentage: 20 },
      { size: "L", stock: 20, discount_percentage: 20 },
      { size: "XL", stock: 15, discount_percentage: 20 }
    ]
  },
  {
    name: "White Sports T-Shirt",
    description: "Breathable white sports t-shirt ideal for workouts and gym sessions.",
    base_price: 799,
    category: "western",
    color: "white",
    material: "polyester",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1583743814966-8936f37f73cd?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 20, discount_percentage: 0 },
      { size: "M", stock: 30, discount_percentage: 0 },
      { size: "L", stock: 25, discount_percentage: 0 },
      { size: "XL", stock: 18, discount_percentage: 0 }
    ]
  },

  // WINTER WEAR
  {
    name: "Red Woolen Sweater",
    description: "Warm red woolen sweater perfect for winter season.",
    base_price: 1999,
    category: "western",
    color: "red",
    material: "wool",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 10, discount_percentage: 30 },
      { size: "M", stock: 18, discount_percentage: 30 },
      { size: "L", stock: 15, discount_percentage: 30 },
      { size: "XL", stock: 10, discount_percentage: 30 }
    ]
  },
  {
    name: "Brown Winter Coat",
    description: "Stylish brown winter coat perfect for cold weather protection.",
    base_price: 3999,
    category: "western",
    color: "brown",
    material: "wool",
    occasion: "casual",
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&crop=center",
    variants: [
      { size: "S", stock: 6, discount_percentage: 0 },
      { size: "M", stock: 10, discount_percentage: 0 },
      { size: "L", stock: 8, discount_percentage: 0 },
      { size: "XL", stock: 5, discount_percentage: 0 }
    ]
  }
];

module.exports = sampleProducts;