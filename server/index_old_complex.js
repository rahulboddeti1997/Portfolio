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

app.get("/autocomplete", async (req, res) => {
  try {
    const query = req.query.query;
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Small delay to prevent excessive API calls
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('Getting fashion suggestions for:', query);

    // Get smart fashion suggestions from OpenAI
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
    const suggestions = suggestionData.suggestions || [];

    console.log('Fashion suggestions:', suggestions);

    res.json({ suggestions });

  } catch (error) {
    console.error('Autocomplete error:', error);
    
    // Simple fallback suggestions
    const fallbackSuggestions = [
      'casual wear', 'formal dress', 'party outfit', 'office wear'
    ];
    
    res.json({ suggestions: fallbackSuggestions });
  }
      const matrix = [];
      const len1 = str1.length;
      const len2 = str2.length;

      for (let i = 0; i <= len2; i++) {
        matrix[i] = [i];
      }

      for (let j = 0; j <= len1; j++) {
        matrix[0][j] = j;
      }

      for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1, // substitution
              matrix[i][j - 1] + 1,     // insertion
              matrix[i - 1][j] + 1      // deletion
            );
          }
        }
      }

      const maxLen = Math.max(len1, len2);
      return maxLen === 0 ? 1 : (maxLen - matrix[len2][len1]) / maxLen;
    }

    function isSimilar(str1, str2, threshold = 0.6) {
      if (str1.includes(str2) || str2.includes(str1)) return true;
      
      return calculateSimilarity(str1, str2) >= threshold;
    }

    const spellCorrections = {
      'tshirt': 't-shirt',
      'tee shirt': 't-shirt',
      'kurtha': 'kurta',
      'kurtha': 'kurta',
      'saari': 'saree',
      'saaree': 'saree',
      'jean': 'jeans',
      'jeens': 'jeans',
      'dreses': 'dress',
      'dres': 'dress',
      'dresses': 'dress',
      'shrit': 'shirt',
      'shirst': 'shirt',
      'shitr': 'shirt',
      'jaket': 'jacket',
      'jakket': 'jacket',
      'jackat': 'jacket',
      'pant': 'pants',
      'trouser': 'trousers',
      'sneekers': 'sneakers',
      'sneeker': 'sneakers',
      'heals': 'heels',
      'sandel': 'sandals',
      'weddig': 'wedding',
      'weding': 'wedding',
      'weeding': 'wedding',
      'partie': 'party',
      'partee': 'party',
      'ofice': 'office',
      'offce': 'office',
      'casuel': 'casual',
      'casuel': 'casual',
      'formol': 'formal',
      'formall': 'formal',
      'blu': 'blue',
      'bleu': 'blue',
      'red': 'red',
      'blak': 'black',
      'balck': 'black',
      'whit': 'white',
      'wite': 'white',
      'grean': 'green',
      'gren': 'green',
      'purpel': 'purple',
      'purpal': 'purple',
      'yelow': 'yellow',
      'yello': 'yellow'
    };

    let correctedQuery = queryLower;
    for (const [wrong, correct] of Object.entries(spellCorrections)) {
      if (correctedQuery.includes(wrong)) {
        correctedQuery = correctedQuery.replace(new RegExp(wrong, 'g'), correct);
        console.log(`Spell corrected: ${queryLower} -> ${correctedQuery}`);
      }
    }

    const fashionDatabase = {
      tops: ['t-shirt', 'tank top', 'blouse', 'shirt', 'polo shirt', 'crop top', 'halter top', 'tube top', 'bodysuit', 'tunic', 'kurta', 'kurti'],
      bottoms: ['jeans', 'pants', 'shorts', 'skirt', 'leggings', 'trousers', 'joggers', 'sweatpants', 'palazzo pants', 'culottes', 'churidar', 'salwar'],
      dresses: ['dress', 'maxi dress', 'mini dress', 'midi dress', 'cocktail dress', 'evening dress', 'casual dress', 'formal dress', 'summer dress', 'party dress', 'gown'],
      outerwear: ['jacket', 'coat', 'blazer', 'cardigan', 'sweater', 'hoodie', 'vest', 'poncho', 'cape', 'windbreaker', 'shrug'],
      ethnic: ['saree', 'kurta', 'kurti', 'lehenga', 'salwar kameez', 'churidar', 'palazzo set', 'anarkali', 'sharara', 'gharara'],
      
      bags: ['bag', 'handbag', 'backpack', 'tote bag', 'crossbody bag', 'clutch', 'shoulder bag', 'messenger bag', 'wallet', 'purse', 'potli bag'],
      shoes: ['shoes', 'sneakers', 'heels', 'boots', 'sandals', 'flats', 'loafers', 'pumps', 'wedges', 'athletic shoes', 'juttis', 'kolhapuris'],
      jewelry: ['necklace', 'earrings', 'bracelet', 'ring', 'watch', 'pendant', 'chain', 'anklet', 'brooch', 'cufflinks', 'mangalsutra', 'bangles'],
      accessories: ['belt', 'scarf', 'hat', 'cap', 'sunglasses', 'gloves', 'tie', 'bow tie', 'headband', 'hair clip', 'dupatta', 'stole'],

      colors: ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'brown', 'gray', 'navy', 'beige', 'khaki', 'maroon', 'gold', 'silver'],
      
      materials: ['cotton', 'denim', 'silk', 'leather', 'wool', 'linen', 'polyester', 'cashmere', 'satin', 'velvet', 'chiffon', 'lace', 'georgette', 'crepe'],
      
      styles: ['casual', 'formal', 'business', 'party', 'vintage', 'bohemian', 'classic', 'trendy', 'sporty', 'elegant', 'chic', 'minimalist', 'ethnic', 'indo-western'],
      
      occasions: ['work', 'party', 'wedding', 'beach', 'gym', 'travel', 'date night', 'office', 'vacation', 'brunch', 'festival', 'ceremony', 'casual outing'],
      
      seasons: ['summer', 'winter', 'spring', 'fall', 'autumn', 'monsoon'],
      
      patterns: ['striped', 'floral', 'polka dot', 'plaid', 'geometric', 'animal print', 'solid', 'paisley', 'abstract', 'embroidered', 'printed'],

      priceRanges: ['under 500', 'under 1000', 'under 1500', 'under 2000', 'under 3000', 'under 5000']
    };

    let suggestions = new Set();

    Object.values(fashionDatabase).flat().forEach(item => {
      // Exact or substring match
      if (item.toLowerCase().includes(correctedQuery)) {
        suggestions.add(item);
      }
      else if (isSimilar(item.toLowerCase(), correctedQuery, 0.7)) {
        suggestions.add(item);
      }
      else {
        const itemWords = item.toLowerCase().split(' ');
        const queryWords = correctedQuery.split(' ');
        
        let matchCount = 0;
        for (const queryWord of queryWords) {
          if (queryWord.length >= 3) {
            for (const itemWord of itemWords) {
              if (itemWord.includes(queryWord) || isSimilar(itemWord, queryWord, 0.75)) {
                matchCount++;
                break;
              }
            }
          }
        }
        
        if (matchCount >= Math.min(queryWords.length, 2)) {
          suggestions.add(item);
        }
      }
    });

    if (correctedQuery.includes('under') || correctedQuery.includes('below')) {
      const pricePatterns = [
        'under 500', 'under 800', 'under 1000', 'under 1200', 'under 1500', 
        'under 2000', 'under 2500', 'under 3000'
      ];
      
      const baseQuery = correctedQuery.replace(/under\s*\d*/g, '').replace(/below\s*\d*/g, '').trim();
      
      if (baseQuery) {
        pricePatterns.forEach(pricePattern => {
          suggestions.add(`${baseQuery} ${pricePattern}`);
          // Add color variations
          ['red', 'blue', 'black', 'white', 'pink', 'green'].forEach(color => {
            if (baseQuery.includes(color) || correctedQuery.includes(color)) {
              suggestions.add(`${baseQuery} ${pricePattern}`);
            } else if (suggestions.size < 6) {
              suggestions.add(`${color} ${baseQuery} ${pricePattern}`);
            }
          });
        });
      }
    }

    // 2. Advanced combination suggestions (color + item, occasion + item, price filters, etc.)
    if (suggestions.size < 8) {
      // Color combinations with price ranges
      fashionDatabase.colors.forEach(color => {
        if (isSimilar(color, correctedQuery, 0.7) || correctedQuery.includes(color) || color.includes(correctedQuery)) {
          ['dress', 'shirt', 'pants', 'shoes', 'bag', 'kurta', 'saree', 'top'].forEach(item => {
            suggestions.add(`${color} ${item}`);
            // Add price range variations
            if (suggestions.size < 6) {
              suggestions.add(`${color} ${item} under 1000`);
              suggestions.add(`${color} ${item} under 2000`);
            }
          });
        }
      });

      // Occasion-based combinations
      fashionDatabase.occasions.forEach(occasion => {
        if (isSimilar(occasion, correctedQuery, 0.7) || correctedQuery.includes(occasion) || occasion.includes(correctedQuery)) {
          ['dress', 'outfit', 'wear', 'kurta', 'suit', 'saree', 'top'].forEach(item => {
            suggestions.add(`${item} for ${occasion}`);
            // Add color + occasion combinations
            ['red', 'blue', 'black', 'white', 'pink'].forEach(color => {
              if (suggestions.size < 7) {
                suggestions.add(`${color} ${item} for ${occasion}`);
              }
            });
          });
        }
      });

      // Style combinations with occasions
      fashionDatabase.styles.forEach(style => {
        if (isSimilar(style, correctedQuery, 0.7) || correctedQuery.includes(style) || style.includes(correctedQuery)) {
          ['dress', 'shirt', 'pants', 'outfit', 'wear', 'kurta'].forEach(item => {
            suggestions.add(`${style} ${item}`);
            // Add occasion combinations
            if (suggestions.size < 6) {
              suggestions.add(`${style} ${item} for party`);
              suggestions.add(`${style} ${item} for office`);
            }
          });
        }
      });

      // Material combinations with price filters
      fashionDatabase.materials.forEach(material => {
        if (isSimilar(material, correctedQuery, 0.7) || correctedQuery.includes(material) || material.includes(correctedQuery)) {
          ['shirt', 'pants', 'jacket', 'dress', 'kurta'].forEach(item => {
            suggestions.add(`${material} ${item}`);
            if (suggestions.size < 6) {
              suggestions.add(`${material} ${item} under 1500`);
            }
          });
        }
      });

      // Season combinations with occasions
      fashionDatabase.seasons.forEach(season => {
        if (isSimilar(season, correctedQuery, 0.7) || correctedQuery.includes(season) || season.includes(correctedQuery)) {
          ['dress', 'coat', 'outfit', 'collection', 'wear'].forEach(item => {
            suggestions.add(`${season} ${item}`);
            if (suggestions.size < 6) {
              suggestions.add(`${season} ${item} for party`);
            }
          });
        }
      });

      // Price-based suggestions
      const priceRanges = ['under 500', 'under 1000', 'under 1500', 'under 2000', 'under 3000'];
      priceRanges.forEach(priceRange => {
        if (priceRange.includes(correctedQuery) || correctedQuery.includes('under')) {
          ['dress', 'shirt', 'kurta', 'saree', 'top', 'pants', 'jeans'].forEach(item => {
            if (suggestions.size < 7) {
              suggestions.add(`${item} ${priceRange}`);
              suggestions.add(`party ${item} ${priceRange}`);
              suggestions.add(`wedding ${item} ${priceRange}`);
            }
          });
        }
      });

      // Complex pattern suggestions (enhanced for incomplete queries)
      const queryWords = correctedQuery.split(' ');
      
      // Red + dress/kurta + wedding patterns
      if (queryWords.some(word => isSimilar(word, 'red', 0.7)) || 
          queryWords.some(word => isSimilar(word, 'kurta', 0.7)) || 
          queryWords.some(word => isSimilar(word, 'wedding', 0.7))) {
        suggestions.add('red kurta under 1000 for wedding');
        suggestions.add('red kurta for wedding');
        suggestions.add('kurta under 1000 for wedding');
        suggestions.add('red saree under 2000 for wedding');
        suggestions.add('wedding outfit under 1500');
        suggestions.add('red dress under 1200 for wedding');
      }

      // Blue + dress + party patterns
      if (queryWords.some(word => isSimilar(word, 'blue', 0.7)) || 
          queryWords.some(word => isSimilar(word, 'dress', 0.7)) || 
          queryWords.some(word => isSimilar(word, 'party', 0.7))) {
        suggestions.add('blue dress under 1500 for party');
        suggestions.add('party dress under 1000');
        suggestions.add('blue party dress');
        suggestions.add('formal dress under 2000');
        suggestions.add('blue dress under 1200');
      }

      // Black + office patterns
      if (queryWords.some(word => isSimilar(word, 'black', 0.7)) || 
          queryWords.some(word => isSimilar(word, 'office', 0.7))) {
        suggestions.add('black shirt for office');
        suggestions.add('office wear under 1000');
        suggestions.add('formal black pants');
        suggestions.add('business outfit under 1500');
        suggestions.add('black dress under 1200');
      }

      // Any color + dress + "under" patterns
      const colors = ['red', 'blue', 'black', 'white', 'pink', 'green', 'yellow', 'purple'];
      const hasColor = queryWords.some(word => colors.some(color => isSimilar(word, color, 0.7)));
      const hasDress = queryWords.some(word => isSimilar(word, 'dress', 0.7));
      const hasUnder = queryWords.some(word => word.includes('under') || word.includes('below'));
      
      if (hasColor && hasDress) {
        const detectedColor = queryWords.find(word => colors.some(color => isSimilar(word, color, 0.7))) || 'red';
        suggestions.add(`${detectedColor} dress under 1000`);
        suggestions.add(`${detectedColor} dress under 1500`);
        suggestions.add(`${detectedColor} dress under 2000`);
        suggestions.add(`${detectedColor} dress for party`);
        suggestions.add(`${detectedColor} formal dress`);
      }
      
      if (hasUnder && hasDress && !hasColor) {
        suggestions.add('dress under 1000');
        suggestions.add('dress under 1500');
        suggestions.add('party dress under 1200');
        suggestions.add('formal dress under 2000');
        suggestions.add('casual dress under 800');
      }
    }

    // 3. Partial word matching for better suggestions (with fuzzy matching)
    if (suggestions.size < 6) {
      Object.values(fashionDatabase).flat().forEach(item => {
        const words = item.split(' ');
        words.forEach(word => {
          if (word.toLowerCase().startsWith(correctedQuery) && word.length > correctedQuery.length) {
            suggestions.add(item);
          }
          // Fuzzy partial matching
          else if (correctedQuery.length >= 3 && isSimilar(word.toLowerCase(), correctedQuery, 0.8)) {
            suggestions.add(item);
          }
        });
      });
    }
    // 4. Database search for existing fashion products
    let dbSuggestions = [];
    try {
      const { data: products } = await supabase
        .from('products')
        .select('title')
        .or(`title.ilike.%${query}%,category.ilike.%${query}%`)
        .in('category', ['clothing', 'fashion', 'apparel', 'accessories', 'footwear', 'bags', 'jewelry'])
        .limit(5);

      if (products) {
        dbSuggestions = products.map(p => p.title);
      }
    } catch (dbError) {
      console.log('Database search skipped:', dbError.message);
    }

    const popularSearches = [
      'summer dress under 1000', 'casual shirt under 800', 'formal wear under 2000', 'winter jacket under 1500',
      'party dress under 1200', 'office wear under 1000', 'jeans under 800', 'kurta under 600',
      
      'wedding outfit under 2000', 'party dress under 1500', 'office shirt under 800', 'gym wear under 500',
      'date night dress under 1000', 'vacation outfit under 1200', 'festival wear under 1500', 'casual wear under 600',
      
      'red kurta for wedding', 'blue dress for party', 'black shirt for office', 'white top for summer',
      'pink saree for festival', 'navy suit for business', 'green dress for casual', 'yellow kurti for day wear',
      
      // Complex combinations
      'red kurta under 1000 for wedding', 'blue party dress under 1500', 'black formal wear under 2000',
      'ethnic wear under 1000', 'indo-western outfit under 1500', 'designer kurta under 2000',
      'silk saree under 3000', 'cotton dress under 800', 'denim jacket under 1200'
    ];

    // Add popular searches if they match (with fuzzy matching)
    popularSearches.forEach(search => {
      if (search.toLowerCase().includes(correctedQuery) || isSimilar(search.toLowerCase(), correctedQuery, 0.6)) {
        suggestions.add(search);
      }
    });

    // Convert Set to Array and limit to 8 suggestions
    let finalSuggestions = Array.from(suggestions);

    // Add database suggestions
    dbSuggestions.forEach(dbSuggestion => {
      if (finalSuggestions.length < 8) {
        finalSuggestions.push(dbSuggestion);
      }
    });

    // Remove duplicates and limit
    finalSuggestions = [...new Set(finalSuggestions)].slice(0, 8);

    // Sort by relevance (exact matches first, then partial matches)
    finalSuggestions.sort((a, b) => {
      const aExact = a.toLowerCase() === queryLower;
      const bExact = b.toLowerCase() === queryLower;
      const aStarts = a.toLowerCase().startsWith(queryLower);
      const bStarts = b.toLowerCase().startsWith(queryLower);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      return a.localeCompare(b);
    });

    console.log('Fashion autocomplete suggestions:', finalSuggestions);

    res.json({ 
      suggestions: finalSuggestions
    });

  } catch (error) {
    console.error('Autocomplete error:', error);
    
    // Fallback suggestions for common fashion terms
    const fallbackSuggestions = [
      'casual wear', 'formal dress', 'summer outfit', 'winter coat',
      'party dress', 'office wear', 'weekend style', 'trendy tops'
    ];
    
    res.json({ 
      suggestions: fallbackSuggestions.slice(0, 4)
    });
  }
});

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


const PORT = process.env.PORT || 5000; 
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
