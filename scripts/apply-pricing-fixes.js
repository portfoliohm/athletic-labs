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

async function applyPricingFixes() {
  try {
    console.log('Applying critical pricing fixes...');
    
    // First, update menu template pricing (multiply by 100 / 60 to get correct per-person pricing)
    const templateUpdates = [
      { id: '660e8400-e29b-41d4-a716-446655440001', price: 49.00 }, // BYO MED BOWL: 2940/60
      { id: '660e8400-e29b-41d4-a716-446655440002', price: 40.00 }, // BYO BURRITO BOWL: 2400/60
      { id: '660e8400-e29b-41d4-a716-446655440003', price: 43.33 }, // BYO ASIAN BOWL: 2600/60
      { id: '660e8400-e29b-41d4-a716-446655440004', price: 36.67 }, // BYO PASTA BOWL: 2200/60
      { id: '660e8400-e29b-41d4-a716-446655440005', price: 47.33 }, // TASTE OF MIAMI: 2840/60
      { id: '660e8400-e29b-41d4-a716-446655440006', price: 53.33 }, // LITTLE ITALY: 3200/60
      { id: '660e8400-e29b-41d4-a716-446655440007', price: 63.33 }, // THE CHOPHOUSE: 3800/60
      { id: '660e8400-e29b-41d4-a716-446655440008', price: 76.50 }, // CHEF ADAM EXPERIENCE: 4590/60
      { id: '660e8400-e29b-41d4-a716-446655440009', price: 30.00 }, // BREAKFAST ESSENTIALS: 1800/60
      { id: '660e8400-e29b-41d4-a716-446655440010', price: 36.67 }, // BREAKFAST SPECIALS GO-TO BRUNCH: 2200/60
      { id: '660e8400-e29b-41d4-a716-446655440011', price: 40.00 }  // BREAKFAST MENU (Specials): 2400/60
    ];
    
    console.log('Updating menu template pricing...');
    for (const update of templateUpdates) {
      const { error } = await supabase
        .from('menu_templates')
        .update({ bundle_price: update.price })
        .eq('id', update.id);
      
      if (error) {
        console.error(`Error updating template ${update.id}:`, error);
      } else {
        console.log(`✓ Updated template ${update.id} to $${update.price}`);
      }
    }
    
    // Check if we need to add columns to menu_items
    console.log('Checking menu_items table structure...');
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('*')
      .limit(1);
    
    console.log('Sample menu item structure:', menuItems?.[0]);
    
    // Check current template pricing
    console.log('Verifying template pricing...');
    const { data: templates } = await supabase
      .from('menu_templates')
      .select('name, bundle_price')
      .order('name');
    
    console.log('Current template pricing:');
    templates?.forEach(t => {
      console.log(`${t.name}: $${t.bundle_price}`);
    });
    
    console.log('Pricing fixes applied successfully!');
    
  } catch (error) {
    console.error('Failed to apply pricing fixes:', error);
  }
}

applyPricingFixes();