const autocompleteService = require('../services/autocompleteService');

class AutocompleteController {
  async getSuggestions(req, res) {
    try {
      const { query } = req.query;
      
      if (!query || query.length < 2) {
        return res.json({ suggestions: [] });
      }

      // Small delay to prevent excessive API calls
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Getting fashion suggestions for:', query);

      const suggestions = await autocompleteService.getFashionSuggestions(query);
      
      console.log('Fashion suggestions:', suggestions);

      res.json({ suggestions });
    } catch (error) {
      console.error('Autocomplete controller error:', error);
      
      const fallbackSuggestions = autocompleteService.getFallbackSuggestions();
      res.json({ suggestions: fallbackSuggestions });
    }
  }
}

module.exports = new AutocompleteController();