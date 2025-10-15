const searchService = require('../services/searchService');

class SearchController {
  async searchProducts(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
      }

      const results = await searchService.searchProducts(query);
      res.json(results);
    } catch (error) {
      console.error("Search controller error:", error);
      res.status(500).json({ error: "Search failed" });
    }
  }
}

module.exports = new SearchController();