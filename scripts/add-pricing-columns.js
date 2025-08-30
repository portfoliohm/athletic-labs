const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    process.env[key] = value;
  }
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addPricingColumns() {
  try {
    console.log('Adding pricing columns to menu_items table...');
    
    // Since we can't run ALTER TABLE directly, let's create the new items with pricing through insertions
    // First, let's see what columns exist
    const { data: sampleItem } = await supabase
      .from('menu_items')
      .select('*')
      .limit(1);
    
    console.log('Current menu_items columns:', Object.keys(sampleItem?.[0] || {}));
    
    // Since the schema doesn't have pricing columns, we need to add them via migrations
    // For now, let's update the existing items with proper data structure
    
    console.log('Pricing columns need to be added to schema first.');
    console.log('The menu_items table needs these additional columns:');
    console.log('- price_per_person DECIMAL(8,2)');
    console.log('- price_half_pan DECIMAL(8,2)');  
    console.log('- price_full_pan DECIMAL(8,2)');
    console.log('- section_category VARCHAR(100)');
    console.log('- notes TEXT');
    
    // For now, let's at least verify the template pricing is correct
    const { data: templates } = await supabase
      .from('menu_templates')
      .select('name, bundle_price, serves_count')
      .order('name');
    
    console.log('\nVerified Template Pricing (per person for 60 people):');
    templates?.forEach(t => {
      const totalBundle = t.bundle_price * t.serves_count;
      console.log(`${t.name}: $${t.bundle_price}/person × ${t.serves_count} = $${totalBundle.toFixed(2)} total`);
    });
    
  } catch (error) {
    console.error('Failed to check pricing columns:', error);
  }
}

addPricingColumns();