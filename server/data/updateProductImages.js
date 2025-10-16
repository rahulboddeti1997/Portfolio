const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sampleProducts = require('./sampleProducts');

const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProductImages() {
  try {
    console.log('🖼️  Starting to update product images...');
    
    // Get all existing products
    const { data: existingProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name');
      
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`📦 Found ${existingProducts.length} existing products`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const existingProduct of existingProducts) {
      try {
        // Find the corresponding product in sample data
        const sampleProduct = sampleProducts.find(p => p.name === existingProduct.name);
        
        if (!sampleProduct || !sampleProduct.image_url) {
          console.log(`⚠️  No image URL found for: ${existingProduct.name}`);
          continue;
        }
        
        // Update the product with image URL
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: sampleProduct.image_url })
          .eq('id', existingProduct.id);
          
        if (updateError) {
          console.error(`❌ Error updating ${existingProduct.name}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated image for: ${existingProduct.name}`);
          successCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${existingProduct.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Image Update Summary:');
    console.log(`✅ Successfully updated: ${successCount}`);
    console.log(`❌ Failed updates: ${errorCount}`);
    console.log(`📦 Total products processed: ${existingProducts.length}`);
    
    if (successCount > 0) {
      console.log('\n🎉 Product images updated successfully!');
      console.log('🖼️  Your products should now display images.');
    }
    
  } catch (error) {
    console.error('💥 Fatal error during image update:', error);
    process.exit(1);
  }
}

// Run the updater
if (require.main === module) {
  updateProductImages()
    .then(() => {
      console.log('\n🏁 Image update process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Image update failed:', error);
      process.exit(1);
    });
}

module.exports = { updateProductImages };