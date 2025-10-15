const openai = require('../config/openai');

class AutocompleteService {
  async getFashionSuggestions(query) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a fashion e-commerce autocomplete assistant. Generate 6-8 relevant fashion search suggestions for the given query. 

            Focus on:
            - Clothing items (dresses, shirts, pants, kurtas, sarees, etc.)
            - Fashion accessories (bags, shoes, jewelry, etc.)
            - Color + item combinations (red dress, blue shirt, etc.)
            - Price ranges (under 1000, under 1500, etc.)
            - Occasions (wedding, party, office, casual, etc.)
            - Complete suggestions like "red kurta under 1000 for wedding"

            Return a JSON object with a "suggestions" array of strings: {"suggestions": ["suggestion1", "suggestion2", ...]}`
          },
          { 
            role: "user", 
            content: `Fashion search: "${query}"` 
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 200,
        temperature: 0.7
      });

      const suggestionData = JSON.parse(response.choices[0].message.content);
      return suggestionData.suggestions || [];
    } catch (error) {
      console.error('OpenAI autocomplete error:', error);
      return this.getFallbackSuggestions();
    }
  }

  getFallbackSuggestions() {
    return [
      'casual wear', 
      'formal dress', 
      'party outfit', 
      'office wear',
      'summer collection',
      'winter wear'
    ];
  }
}

module.exports = new AutocompleteService();