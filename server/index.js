const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend 🚀" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
}


app.get("/products", async (req, res) => {
    try {
        const { data: products, error: productError } = await supabase
            .from("products")
            .select("*");

        if (productError) return res.status(400).json({ error: productError });

        const { data: variants, error: variantError } = await supabase
            .from("product_variants")
            .select("*");

        if (variantError) return res.status(400).json({ error: variantError });

        const productMap = products.map(p => {
            const pVariants = variants.filter(v => v.product_id === p.id).map(v => {
                let effective_price = v.price_override
                    ? v.price_override
                    : Math.round(p.base_price - (p.base_price * (v.discount_percentage || 0) / 100));

                return {
                    ...v,
                    effective_price
                };
            });

            return {
                ...p,
                variants: pVariants
            };
        });

        res.json(productMap);
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post("/add-product", async (req, res) => {
    try {
        const {
            name, description, category, color, material, occasion, base_price, image_url, variants
        } = req.body;

        const embeddingText = `${name}. ${description}. Category: ${category}. Color: ${color || ""}. Material: ${material || ""}. Occasion: ${occasion || ""}. Base price: ${base_price}`;
        const embedding = await generateEmbedding(embeddingText);

        const { data: product, error: productError } = await supabase
            .from("products")
            .insert([
                { name, description, category, color, material, occasion, base_price, image_url, embedding }
            ])
            .select()
            .single();

        if (productError) {
            console.error("Product insert error:", productError);
            return res.status(400).json({ error: productError });
        }

        let variantData = [];
        if (variants && variants.length > 0) {
            const { data: insertedVariants, error: variantError } = await supabase
                .from("product_variants")
                .insert(
                    variants.map(v => ({
                        product_id: product.id,
                        size: v.size,
                        stock: v.stock || 0,
                        discount_percentage: v.discount_percentage || 0,
                        price_override: v.price_override || null
                    }))
                )
                .select();

            if (variantError) {
                console.error("Variant insert error:", variantError);
                return res.status(400).json({ error: variantError });
            }

            variantData = insertedVariants;
        }

        res.json({ ...product, variants: variantData });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

async function generateEmbedding(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return response.data[0].embedding;
}

app.get("/search", async (req, res) => {
  try {
    const query = req.query.query;

    const queryEmbedding = await generateEmbedding(query);

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

    const filters = JSON.parse(filterResponse.choices[0].message.content);

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
      console.error("Search error:", searchError);
      return res.status(400).json({ error: searchError });
    }

    if (!rows || rows.length === 0) {
      return res.json({ original_query: query, filters, results: [] });
    }

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

    res.json({ original_query: query, filters, results });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => res.send("Backend running 🚀"));


const PORT = process.env.PORT || 10000; 
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
