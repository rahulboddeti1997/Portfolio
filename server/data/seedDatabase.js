const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sampleProducts = require('./sampleProducts');

const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Environment check:');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('SUPABASE_KEY:', supabaseKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await supabase.from('product_variants').delete().neq('id', 0);
    await supabase.from('products').delete().neq('id', 0);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const productData of sampleProducts) {
      try {
        const { variants, ...productInfo } = productData;
        
        // Insert product
        const { data: product, error: productError } = await supabase
          .from('products')
          .insert([productInfo])
          .select()
          .single();
        
        if (productError) {
          console.error(`❌ Error inserting product ${productInfo.name}:`, productError.message);
          errorCount++;
          continue;
        }
        
        // Insert variants for this product
        const variantsWithProductId = variants.map(variant => ({
          ...variant,
          product_id: product.id
        }));
        
        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantsWithProductId);
        
        if (variantsError) {
          console.error(`❌ Error inserting variants for ${productInfo.name}:`, variantsError.message);
          errorCount++;
        } else {
          console.log(`✅ Successfully added: ${productInfo.name} with ${variants.length} variants`);
          successCount++;
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Unexpected error with product ${productData.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Seeding Summary:');
    console.log(`✅ Successful products: ${successCount}`);
    console.log(`❌ Failed products: ${errorCount}`);
    console.log(`📦 Total products attempted: ${sampleProducts.length}`);
    
    if (successCount > 0) {
      console.log('\n🎉 Database seeding completed successfully!');
      console.log('You can now test your application with the sample data.');
    }
    
  } catch (error) {
    console.error('💥 Fatal error during seeding:', error);
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🏁 Seeding process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };