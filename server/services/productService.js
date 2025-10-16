const supabase = require('../config/database');
const searchService = require('./searchService');

class ProductService {
  async getAllProducts() {
    try {
      const { data: products, error: productError } = await supabase
        .from("products")
        .select("*");

      if (productError) {
        throw productError;
      }

      // Get variants for each product
      const productsWithVariants = await Promise.all(
        products.map(async (product) => {
          const { data: variants, error: variantError } = await supabase
            .from("product_variants")
            .select("*")
            .eq("product_id", product.id);

          if (variantError) {
            console.error("Variant fetch error:", variantError);
            return { ...product, variants: [] };
          }

          return { ...product, variants };
        })
      );

      return productsWithVariants;
    } catch (error) {
      console.error("Product fetch error:", error);
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      const { name, description, base_price, category, color, material, occasion, variants } = productData;

      // Generate embedding for semantic search
      const embeddingText = `${name}. ${description}. Category: ${category}. Color: ${color || ""}. Material: ${material || ""}. Occasion: ${occasion || ""}. Base price: ${base_price}`;
      const embedding = await searchService.generateEmbedding(embeddingText);

      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          name,
          description,
          base_price,
          category,
          color,
          material,
          occasion,
          embedding
        })
        .select()
        .single();

      if (productError) {
        throw productError;
      }

      let variantData = [];
      if (variants && variants.length > 0) {
        const variantsWithProductId = variants.map(variant => ({
          ...variant,
          product_id: product.id
        }));

        const { data: insertedVariants, error: variantError } = await supabase
          .from("product_variants")
          .insert(variantsWithProductId)
          .select();

        if (variantError) {
          throw variantError;
        }

        variantData = insertedVariants;
      }

      return { ...product, variants: variantData };
    } catch (error) {
      console.error("Product creation error:", error);
      throw error;
    }
  }
}

module.exports = new ProductService();