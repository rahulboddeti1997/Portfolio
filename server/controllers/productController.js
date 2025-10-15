const productService = require('../services/productService');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Product controller error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      res.json(product);
    } catch (error) {
      console.error("Product creation controller error:", error);
      res.status(400).json({ error: "Failed to create product" });
    }
  }
}

module.exports = new ProductController();