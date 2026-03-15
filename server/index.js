const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require('./routes/products');
const autocompleteRoutes = require('./routes/autocomplete');
const searchRoutes = require('./routes/search');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend 🚀" });
});

app.use("/products", productRoutes);
app.use("/autocomplete", autocompleteRoutes);
app.use("/search", searchRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "Server is running 🚀",
    timestamp: new Date().toISOString(),
    endpoints: {
      products: "/products",
      search: "/search",
      autocomplete: "/autocomplete"
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
  
  // Handle React Router routes
  app.use((req, res, next) => {
    if (!req.url.startsWith('/api') && 
        !req.url.startsWith('/products') && 
        !req.url.startsWith('/search') && 
        !req.url.startsWith('/autocomplete')) {
      res.sendFile(path.join(__dirname, "../build/index.html"));
    } else {
      next();
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Available endpoints:`);
  console.log(`   GET  /products`);
  console.log(`   POST /products`);
  console.log(`   GET  /search?query=...`);
  console.log(`   GET  /autocomplete?query=...`);
});