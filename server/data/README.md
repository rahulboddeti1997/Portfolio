# Sample Fashion Data - 50+ Products

This directory contains a comprehensive fashion product dataset focused on **men's and women's clothing and footwear** for your e-commerce application.

## Dataset Overview

### `sampleProducts.js`
Contains **50+ diverse fashion products** across these categories:

#### **Women's Western Wear** (20+ items)
- **Dresses**: Evening dresses, midi dresses, summer dresses, party dresses
- **Tops & Blouses**: Floral tops, cotton blouses, formal shirts
- **Formal Wear**: Blazers, formal skirts, office wear

#### **Women's Ethnic Wear** (8+ items)  
- **Sarees**: Silk sarees, cotton sarees, georgette sarees
- **Kurtis**: Cotton kurtis, printed kurtis, embroidered kurtis
- **Traditional**: Anarkali suits, lehengas

#### **Men's Western Wear** (15+ items)
- **Shirts**: Formal shirts, casual shirts, t-shirts
- **Pants**: Formal pants, jeans, chinos, shorts
- **Jackets**: Leather jackets, denim jackets, hoodies

#### **Men's Ethnic Wear** (3+ items)
- **Kurtas**: Cotton kurtas, silk kurtas, linen kurtas

#### **Footwear** (8+ items)
- **Men's**: Formal shoes, casual shoes, sneakers, canvas shoes
- **Women's**: High heels, sandals, flat shoes

#### **Additional Categories**
- **Sportswear**: Track pants, sports t-shirts
- **Winter Wear**: Sweaters, coats, jackets

## Key Features

### **Verified Image URLs**
- All images sourced from **Unsplash** (free commercial use)
- **Verified working URLs** - no 404 errors
- Consistent sizing (400x500) for optimal display
- High-quality fashion photography

### **Realistic Data Structure**
- **Price Range**: ₹599 - ₹4999 (affordable to premium)
- **Size Variants**: Clothing (XS-XXL), Shoes (5-11), Standard sizes
- **Stock Management**: Realistic inventory numbers (5-30 per variant)
- **Discount System**: 0% to 30% discounts on select items
- **Categories**: `western`, `ethnic`, `footwear`
- **Occasions**: `casual`, `office`, `party`, `wedding`
- **Materials**: `cotton`, `silk`, `denim`, `leather`, `polyester`, etc.

### **Color Variety**
Black, White, Blue, Red, Pink, Navy, Gray, Brown, Green, Cream, Maroon, Yellow

### `seedDatabase.js`
Database seeding script that:
- Connects to your Supabase database
- Inserts all sample products and variants
- Provides detailed logging and error handling
- Shows success/failure summary

## Usage

### Option 1: Run the seeder directly
```bash
cd server/data
node seedDatabase.js
```

### Option 2: Add to package.json scripts
Add this to your `server/package.json`:
```json
{
  "scripts": {
    "seed": "cd data && node seedDatabase.js"
  }
}
```

Then run:
```bash
npm run seed
```

### Option 3: Import in your application
```javascript
const { seedDatabase } = require('./data/seedDatabase');

// Call when needed
await seedDatabase();
```

## Prerequisites

1. **Environment Variables**: Ensure your `.env` file has:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Database Tables**: Make sure your Supabase tables exist:
   - `products` table with columns: name, description, base_price, category, color, material, occasion, image_url
   - `product_variants` table with columns: product_id, size, stock, discount_percentage

3. **Dependencies**: Install required packages:
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

## Image Sources

All product images are sourced from [Unsplash](https://unsplash.com/) and are free to use for commercial purposes. The images are properly sized (500x600) and optimized for web display.

## Customization

### Adding More Products
Edit `sampleProducts.js` and add new products following the same structure:

```javascript
{
  name: "Product Name",
  description: "Product description",
  base_price: 1299, // Price in paise (₹12.99)
  category: "clothing", // clothing, ethnic, footwear, accessories, jewelry
  color: "blue",
  material: "cotton",
  occasion: "casual", // casual, office, party, wedding
  image_url: "https://images.unsplash.com/photo-id?w=500&h=600&fit=crop",
  variants: [
    { size: "S", stock: 10, discount_percentage: 0 },
    // ... more variants
  ]
}
```

### Clearing Existing Data
Uncomment these lines in `seedDatabase.js` to clear existing data before seeding:
```javascript
await supabase.from('product_variants').delete().neq('id', 0);
await supabase.from('products').delete().neq('id', 0);
```

## Sample Categories

The sample data covers these fashion categories:
- **Clothing**: Dresses, shirts, pants, jackets, sweaters
- **Ethnic**: Kurtas, kurtis, traditional wear
- **Footwear**: Formal shoes, casual sneakers
- **Accessories**: Bags, backpacks
- **Jewelry**: Necklaces, earrings

This provides a comprehensive dataset to showcase your e-commerce application's features like filtering, search, and product variants.