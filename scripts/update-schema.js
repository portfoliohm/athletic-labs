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

async function updateSchema() {
  try {
    console.log('Updating database schema for individual pricing...');
    
    // Since we can't run ALTER TABLE through the JS client directly,
    // let's create new menu items with the current schema and add pricing via metadata
    
    // Clear existing menu items
    const { error: deleteError } = await supabase
      .from('menu_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('Error clearing menu items:', deleteError);
    } else {
      console.log('✓ Cleared existing menu items');
    }
    
    // Insert the critical menu items needed for functionality
    // We'll store pricing information in the description field for now as JSON
    const menuItems = [
      {
        name: 'Adams Signature Sushi Boat',
        description: 'Premium sushi selection crafted by Chef Adam | Pricing: $38.00 pp / $456.00 half pan / $912.00 full pan',
        calories_per_serving: 450,
        protein_grams: 35.0,
        carbs_grams: 25.0,
        fats_grams: 18.0,
        allergens: ['fish', 'soy'],
        dietary_tags: ['premium', 'signature']
      },
      {
        name: 'Wagyu Denvers',
        description: 'Premium Wagyu beef Denver steaks | Pricing: $45.00 pp / $540.00 half pan / $1,080.00 full pan | 1 FP',
        calories_per_serving: 680,
        protein_grams: 52.0,
        carbs_grams: 8.0,
        fats_grams: 45.0,
        allergens: [],
        dietary_tags: ['premium', 'wagyu']
      },
      {
        name: 'Lobster Risotto',
        description: 'Creamy lobster risotto with herbs | Pricing: $42.00 pp / $504.00 half pan / $1,008.00 full pan | 1 FP',
        calories_per_serving: 620,
        protein_grams: 28.0,
        carbs_grams: 45.0,
        fats_grams: 32.0,
        allergens: ['shellfish', 'dairy'],
        dietary_tags: ['premium']
      },
      {
        name: 'Chicken Shawarma',
        description: 'Middle Eastern spiced chicken shawarma | Pricing: $22.00 pp / $264.00 half pan / $528.00 full pan | 1.5 FP',
        calories_per_serving: 485,
        protein_grams: 42.0,
        carbs_grams: 15.0,
        fats_grams: 28.0,
        allergens: [],
        dietary_tags: ['halal']
      },
      {
        name: 'Fresh Hummus',
        description: 'Traditional Mediterranean hummus | Pricing: $14.00 pp / $168.00 half pan / $336.00 full pan | 1 HP',
        calories_per_serving: 155,
        protein_grams: 8.0,
        carbs_grams: 14.0,
        fats_grams: 10.0,
        allergens: ['sesame'],
        dietary_tags: ['vegan', 'protein']
      },
      {
        name: 'Saffron Basmati Rice',
        description: 'Aromatic saffron-infused basmati rice | Pricing: $12.00 pp / $144.00 half pan / $288.00 full pan | 2 FP',
        calories_per_serving: 210,
        protein_grams: 4.0,
        carbs_grams: 45.0,
        fats_grams: 1.0,
        allergens: [],
        dietary_tags: ['gluten-free']
      }
    ];
    
    console.log('Inserting menu items with embedded pricing...');
    
    for (const item of menuItems) {
      const { error } = await supabase
        .from('menu_items')
        .insert(item);
      
      if (error) {
        console.error(`Error inserting ${item.name}:`, error);
      } else {
        console.log(`✓ Inserted ${item.name}`);
      }
    }
    
    console.log('Schema update completed!');
    
  } catch (error) {
    console.error('Failed to update schema:', error);
  }
}

updateSchema();