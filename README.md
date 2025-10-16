# Fashion E-Commerce Portfolio

A modern, full-stack e-commerce application built with React and Express.js, featuring a comprehensive fashion product catalog, advanced search functionality, user authentication, and responsive design.

## �� Live Demo

- **Frontend**: [Deployed on Vercel](https://your-vercel-domain.vercel.app)
- **Backend API**: [Deployed on Render](https://portfolio-0o5m.onrender.com)

## ✨ Features

### 🛍️ E-Commerce Core
- **Product Catalog**: 46+ fashion products across multiple categories (Western, Ethnic, Footwear)
- **Shopping Cart**: Add/remove items, quantity management, persistent storage
- **Wishlist**: Save favorite items for later
- **Product Search**: Real-time search with autocomplete and caching
- **Responsive Design**: Mobile-first approach with optimized layouts

### 🔐 Authentication & User Management
- **Supabase Authentication**: Email/password and Google OAuth
- **Protected Routes**: Secure user profile and order pages
- **User Profiles**: Editable profile information with persistent storage
- **Session Management**: Automatic session handling across browser sessions

### 🎨 UI/UX Excellence
- **Ant Design Components**: Professional, accessible UI components
- **Optimized Performance**: Intersection Observer for lazy loading, debounced search
- **Mobile Responsive**: Touch-friendly interface with adaptive layouts
- **Loading States**: Smooth loading indicators and error handling

### 🔍 Advanced Search
- **Real-time Autocomplete**: Instant suggestions with caching
- **Search History**: Persistent search history (last 10 queries)
- **Smart Caching**: Optimized API calls with client-side caching
- **URL-based Search**: Shareable search URLs with query parameters

### 📊 State Management
- **Redux Toolkit**: Centralized state management
- **Persistent Storage**: Cart and wishlist data persisted in localStorage
- **Optimistic Updates**: Immediate UI feedback with error handling

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Latest React with hooks and functional components
- **Redux Toolkit**: Modern Redux with RTK Query for API calls
- **Ant Design 5**: Comprehensive UI component library
- **React Router 5**: Client-side routing with protected routes
- **Lodash**: Utility library for debouncing and data manipulation

### Backend Stack
- **Express.js 5**: RESTful API server
- **Supabase**: PostgreSQL database with real-time capabilities
- **CORS**: Cross-origin resource sharing configuration
- **Environment Variables**: Secure configuration management

### Database Schema
```sql
-- Products table with comprehensive fashion data
products (
  id: integer (primary key)
  name: varchar
  description: text
  category: varchar
  base_price: decimal
  image_url: varchar
  brand: varchar
  variants: jsonb (sizes, colors, pricing)
  tags: text[]
  created_at: timestamp
)
```

## 📁 Project Structure

```
Portfolio/
├── public/                    # Static assets
├── build/                     # Production build
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── Login.js       # Authentication modal
│   │   ├── Cart.js            # Shopping cart component
│   │   ├── HomePage.js        # Landing page with carousel
│   │   ├── ProductsList.js    # Product grid with search
│   │   ├── Profile.js         # User profile management
│   │   ├── SearchBox.js       # Search with autocomplete
│   │   ├── UserMenu.js        # User dropdown menu
│   │   ├── Loading.js         # Loading indicator
│   │   └── WindowSize.js      # Responsive utilities
│   ├── contexts/
│   │   └── AuthContext.js     # Authentication context
│   ├── redux/
│   │   ├── store.js           # Redux store configuration
│   │   ├── productSlice.js    # Product state management
│   │   └── searchSlice.js     # Search state management
│   ├── App.js                 # Main application component
│   └── index.js               # Application entry point
├── server/
│   ├── routes/
│   │   ├── products.js        # Product API routes
│   │   ├── search.js          # Search API routes
│   │   └── autocomplete.js    # Autocomplete API routes
│   ├── data/
│   │   ├── sampleProducts.js  # Product data
│   │   └── seedDatabase.js    # Database seeding script
│   └── index.js               # Express server
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── Dockerfile                 # Container configuration
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Supabase account (for authentication and database)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rahulboddeti1997/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # API Configuration
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Database setup**
   ```bash
   # Seed the database with sample products
   cd server/data
   node seedDatabase.js
   ```

5. **Start development servers**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # Or start individually:
   npm run start:client  # Frontend on port 3000
   npm run start:server  # Backend on port 5000
   ```

### Production Deployment

#### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy with build command: `npm install`
4. Start command: `npm start`

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables:
   - `REACT_APP_API_URL=https://your-render-backend-url.onrender.com`
   - `REACT_APP_SUPABASE_URL=your_supabase_url`
   - `REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key`
3. Deploy with build command: `npm run build`

## 📚 API Documentation

### Products API
```
GET /products
- Returns all products with variants and pricing
- Response: Array of product objects

POST /products  
- Create new product (admin only)
- Body: Product object with required fields
```

### Search API
```
GET /search?query={searchTerm}
- Full-text search across products
- Query params: query (required)
- Response: { results: Product[], total: number }

GET /autocomplete?query={searchTerm}
- Returns search suggestions
- Query params: query (required, min 3 characters)
- Response: { suggestions: string[] }
```

### Health Check
```
GET /api/health
- Server health status
- Response: { status: string, timestamp: string, endpoints: object }
```

## 🎯 Key Features Implementation

### Performance Optimizations
- **Debounced Search**: 300ms delay to reduce API calls
- **Intersection Observer**: Lazy loading for product images
- **Redux Caching**: Client-side caching for search results
- **Image Optimization**: WebP format with fallbacks

### Mobile Responsiveness
- **Adaptive Layouts**: Different layouts for mobile/desktop
- **Touch Interactions**: Optimized for mobile interactions
- **Responsive Images**: Responsive image sizing
- **Mobile Navigation**: Collapsible navigation menu

### Security Features
- **Environment Variables**: Secure API key management
- **CORS Configuration**: Proper cross-origin setup
- **Authentication**: Secure user authentication with Supabase
- **Input Validation**: Client and server-side validation

## 🛠️ Built With

### Frontend Dependencies
- `react` - UI library
- `@reduxjs/toolkit` - State management
- `antd` - UI components
- `react-router-dom` - Routing
- `@supabase/supabase-js` - Database client
- `lodash` - Utility functions

### Backend Dependencies
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `@supabase/supabase-js` - Database client

### Development Dependencies
- `concurrently` - Run multiple commands
- `nodemon` - Development server
- `tailwindcss` - CSS framework

## 📄 Scripts

```bash
npm run dev          # Start development servers
npm run build        # Build for production
npm start            # Start production server
npm run start:client # Start frontend only
npm run start:server # Start backend only
npm test             # Run tests
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rahul Boddeti**
- GitHub: [@rahulboddeti1997](https://github.com/rahulboddeti1997)
- LinkedIn: [Your LinkedIn Profile]

## 🙏 Acknowledgments

- [Ant Design](https://ant.design/) for the amazing UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Unsplash](https://unsplash.com/) for high-quality product images
- [Render](https://render.com/) and [Vercel](https://vercel.com/) for hosting

## 📞 Support

If you have any questions or need help with setup, please open an issue or reach out via:
- Email: rahul@example.com
- GitHub Issues: [Create an issue](https://github.com/rahulboddeti1997/Portfolio/issues)

---

⭐ **Star this repository if you found it helpful!**
