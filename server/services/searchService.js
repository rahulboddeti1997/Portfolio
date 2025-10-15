const openai = require('../config/openai');
const supabase = require('../config/database');

class SearchService {
  async generateEmbedding(text) {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  }

  async extractFilters(query) {
    try {
      const filterResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Extract filters for ecommerce search. Return JSON:
            {
              "query_text": string,
              "max_price": number|null,
              "category": string|null,
              "color": string|null,
              "size": string|null,
              "material": string|null,
              "occasion": string|null
            }`
          },
          { role: "user", content: `Query: "${query}"` }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(filterResponse.choices[0].message.content);
    } catch (error) {
      console.error('Filter extraction error:', error);
      return {
        query_text: query,
        max_price: null,
        category: null,
        color: null,
        size: null,
        material: null,
        occasion: null
      };
    }
  }

  async searchProducts(query) {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      const filters = await this.extractFilters(query);

      const { data: rows, error: searchError } = await supabase.rpc("match_products", {
        query_embedding: queryEmbedding,
        match_count: 10,
        max_price: filters.max_price,
        category_filter: filters.category,
        color_filter: filters.color,
        size_filter: filters.size,
        material_filter: filters.material,
        occasion_filter: filters.occasion
      });

      if (searchError) {
        throw searchError;
      }

      if (!rows || rows.length === 0) {
        return { original_query: query, filters, results: [] };
      }

      // Group results by product
      const grouped = {};
      for (const row of rows) {
        if (!grouped[row.product_id]) {
          grouped[row.product_id] = {
            product_id: row.product_id,
            name: row.name,
            description: row.description,
            base_price: row.base_price,
            category: row.category,
            color: row.color,
            material: row.material,
            occasion: row.occasion,
            similarity: row.similarity,
            score: row.score,
            variants: []
          };
        }

        grouped[row.product_id].variants.push({
          variant_id: row.variant_id,
          size: row.size,
          stock: row.stock,
          discount_percentage: row.discount_percentage,
          price_override: row.price_override,
          effective_price: row.effective_price
        });
      }

      const results = Object.values(grouped);
      return { original_query: query, filters, results };
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  }
}

module.exports = new SearchService();