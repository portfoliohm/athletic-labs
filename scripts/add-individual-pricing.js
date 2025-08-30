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

async function addIndividualPricing() {
  try {
    console.log('Adding individual pricing to menu items...');
    
    // Delete existing items and recreate with proper pricing
    console.log('Clearing existing menu items...');
    const { error: deleteError } = await supabase
      .from('menu_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError) {
      console.error('Error deleting menu items:', deleteError);
      return;
    }
    
    // Insert all individual menu items with proper pricing
    const menuItems = [
      // Premium/Signature Items
      {
        name: 'Adams Signature Sushi Boat',
        description: 'Premium sushi selection crafted by Chef Adam',
        section_category: 'Premium/Signature',
        price_per_person: 38.00,
        price_half_pan: 456.00,
        price_full_pan: 912.00,
        notes: '',
        calories_per_serving: 450,
        protein_grams: 35.0,
        carbs_grams: 25.0,
        fats_grams: 18.0,
        allergens: ['fish', 'soy'],
        dietary_tags: ['premium', 'signature']
      },
      {
        name: 'Wagyu Denvers',
        description: 'Premium Wagyu beef Denver steaks',
        section_category: 'Premium/Signature',
        price_per_person: 45.00,
        price_half_pan: 540.00,
        price_full_pan: 1080.00,
        notes: '1 FP',
        calories_per_serving: 680,
        protein_grams: 52.0,
        carbs_grams: 8.0,
        fats_grams: 45.0,
        allergens: [],
        dietary_tags: ['premium', 'wagyu']
      },
      {
        name: 'Lobster Risotto',
        description: 'Creamy lobster risotto with herbs',
        section_category: 'Premium/Signature',
        price_per_person: 42.00,
        price_half_pan: 504.00,
        price_full_pan: 1008.00,
        notes: '1 FP',
        calories_per_serving: 620,
        protein_grams: 28.0,
        carbs_grams: 45.0,
        fats_grams: 32.0,
        allergens: ['shellfish', 'dairy'],
        dietary_tags: ['premium']
      },
      {
        name: 'Miso Glazed Chilean Sea Bass',
        description: 'Pan-seared sea bass with miso glaze',
        section_category: 'Premium/Signature',
        price_per_person: 48.00,
        price_half_pan: 576.00,
        price_full_pan: 1152.00,
        notes: '1 FP',
        calories_per_serving: 580,
        protein_grams: 48.0,
        carbs_grams: 12.0,
        fats_grams: 28.0,
        allergens: ['fish', 'soy'],
        dietary_tags: ['premium']
      },
      {
        name: 'Rosemary Dijon Lamb Chops',
        description: 'Herb-crusted lamb chops with Dijon mustard',
        section_category: 'Premium/Signature',
        price_per_person: 44.00,
        price_half_pan: 528.00,
        price_full_pan: 1056.00,
        notes: '1 FP',
        calories_per_serving: 720,
        protein_grams: 55.0,
        carbs_grams: 6.0,
        fats_grams: 48.0,
        allergens: [],
        dietary_tags: ['premium']
      },
      // Base Proteins
      {
        name: 'Chicken Shawarma',
        description: 'Middle Eastern spiced chicken shawarma',
        section_category: 'Base Proteins',
        price_per_person: 22.00,
        price_half_pan: 264.00,
        price_full_pan: 528.00,
        notes: '1.5 FP',
        calories_per_serving: 485,
        protein_grams: 42.0,
        carbs_grams: 15.0,
        fats_grams: 28.0,
        allergens: [],
        dietary_tags: ['halal']
      },
      {
        name: 'Asian Braised Salmon',
        description: 'Teriyaki glazed salmon with Asian spices',
        section_category: 'Base Proteins',
        price_per_person: 28.00,
        price_half_pan: 336.00,
        price_full_pan: 672.00,
        notes: '',
        calories_per_serving: 520,
        protein_grams: 45.0,
        carbs_grams: 12.0,
        fats_grams: 32.0,
        allergens: ['fish', 'soy'],
        dietary_tags: ['omega-3']
      },
      {
        name: 'Pollo a la Plancha',
        description: 'Grilled chicken with Latin spices',
        section_category: 'Base Proteins',
        price_per_person: 24.00,
        price_half_pan: 288.00,
        price_full_pan: 576.00,
        notes: '1.5 FP',
        calories_per_serving: 445,
        protein_grams: 48.0,
        carbs_grams: 8.0,
        fats_grams: 22.0,
        allergens: [],
        dietary_tags: ['grilled']
      },
      {
        name: 'Chimichurri Steak',
        description: 'Grilled steak with chimichurri sauce',
        section_category: 'Base Proteins',
        price_per_person: 32.00,
        price_half_pan: 384.00,
        price_full_pan: 768.00,
        notes: '1.5 FP',
        calories_per_serving: 625,
        protein_grams: 52.0,
        carbs_grams: 6.0,
        fats_grams: 42.0,
        allergens: [],
        dietary_tags: ['grilled']
      },
      // Base Starches
      {
        name: 'Saffron Basmati Rice',
        description: 'Aromatic saffron-infused basmati rice',
        section_category: 'Base Starches',
        price_per_person: 12.00,
        price_half_pan: 144.00,
        price_full_pan: 288.00,
        notes: '2 FP',
        calories_per_serving: 210,
        protein_grams: 4.0,
        carbs_grams: 45.0,
        fats_grams: 1.0,
        allergens: [],
        dietary_tags: ['gluten-free']
      },
      {
        name: 'Jasmine Rice',
        description: 'Fragrant jasmine rice',
        section_category: 'Base Starches',
        price_per_person: 10.00,
        price_half_pan: 120.00,
        price_full_pan: 240.00,
        notes: '2 FP',
        calories_per_serving: 205,
        protein_grams: 4.0,
        carbs_grams: 44.0,
        fats_grams: 0.5,
        allergens: [],
        dietary_tags: ['gluten-free', 'vegan']
      },
      {
        name: 'Fresh Baked Pita',
        description: 'Warm Mediterranean pita bread',
        section_category: 'Base Starches',
        price_per_person: 8.00,
        price_half_pan: 96.00,
        price_full_pan: 192.00,
        notes: '60 pieces',
        calories_per_serving: 165,
        protein_grams: 5.0,
        carbs_grams: 33.0,
        fats_grams: 1.0,
        allergens: ['gluten'],
        dietary_tags: ['vegetarian']
      },
      {
        name: 'Alfredo Sauce',
        description: 'Creamy alfredo pasta sauce',
        section_category: 'Base Starches',
        price_per_person: 14.00,
        price_half_pan: 168.00,
        price_full_pan: 336.00,
        notes: '',
        calories_per_serving: 185,
        protein_grams: 6.0,
        carbs_grams: 8.0,
        fats_grams: 16.0,
        allergens: ['dairy'],
        dietary_tags: ['vegetarian']
      },
      // Base Sides/Vegetables
      {
        name: 'Fresh Hummus',
        description: 'Traditional Mediterranean hummus',
        section_category: 'Base Sides',
        price_per_person: 14.00,
        price_half_pan: 168.00,
        price_full_pan: 336.00,
        notes: '1 HP',
        calories_per_serving: 155,
        protein_grams: 8.0,
        carbs_grams: 14.0,
        fats_grams: 10.0,
        allergens: ['sesame'],
        dietary_tags: ['vegan', 'protein']
      },
      {
        name: 'Tahini Roasted Cauliflower',
        description: 'Roasted cauliflower with tahini dressing',
        section_category: 'Base Sides',
        price_per_person: 16.00,
        price_half_pan: 192.00,
        price_full_pan: 384.00,
        notes: '1 FP',
        calories_per_serving: 125,
        protein_grams: 5.0,
        carbs_grams: 12.0,
        fats_grams: 8.0,
        allergens: ['sesame'],
        dietary_tags: ['vegan']
      },
      {
        name: 'Charred Broccolini',
        description: 'Perfectly charred broccolini with garlic',
        section_category: 'Base Sides',
        price_per_person: 14.00,
        price_half_pan: 168.00,
        price_full_pan: 336.00,
        notes: '',
        calories_per_serving: 85,
        protein_grams: 5.0,
        carbs_grams: 8.0,
        fats_grams: 3.0,
        allergens: [],
        dietary_tags: ['vegan']
      },
      {
        name: 'Roasted Sweet Plantains',
        description: 'Caramelized sweet plantains',
        section_category: 'Base Sides',
        price_per_person: 18.00,
        price_half_pan: 216.00,
        price_full_pan: 432.00,
        notes: '1 FP',
        calories_per_serving: 158,
        protein_grams: 1.0,
        carbs_grams: 40.0,
        fats_grams: 0.5,
        allergens: [],
        dietary_tags: ['vegan']
      },
      // Breakfast Items
      {
        name: 'Almond na Tigela Acai Bowls',
        description: 'Brazilian-style acai bowls with almonds',
        section_category: 'Breakfast',
        price_per_person: 28.00,
        price_half_pan: 336.00,
        price_full_pan: 672.00,
        notes: '',
        calories_per_serving: 320,
        protein_grams: 8.0,
        carbs_grams: 48.0,
        fats_grams: 12.0,
        allergens: ['nuts'],
        dietary_tags: ['antioxidant', 'superfood']
      },
      {
        name: 'Buttermilk Pancakes',
        description: 'Fluffy buttermilk pancakes',
        section_category: 'Breakfast',
        price_per_person: 14.00,
        price_half_pan: 168.00,
        price_full_pan: 336.00,
        notes: '',
        calories_per_serving: 285,
        protein_grams: 8.0,
        carbs_grams: 45.0,
        fats_grams: 8.0,
        allergens: ['gluten', 'dairy', 'eggs'],
        dietary_tags: ['breakfast-classic']
      },
      {
        name: 'Cajeta Churros',
        description: 'Mexican churros with cajeta caramel',
        section_category: 'Breakfast',
        price_per_person: 12.00,
        price_half_pan: 144.00,
        price_full_pan: 288.00,
        notes: '',
        calories_per_serving: 245,
        protein_grams: 4.0,
        carbs_grams: 35.0,
        fats_grams: 12.0,
        allergens: ['gluten', 'dairy'],
        dietary_tags: ['dessert', 'mexican']
      }
    ];
    
    console.log('Inserting menu items with pricing...');
    
    for (const item of menuItems) {
      const { error } = await supabase
        .from('menu_items')
        .insert({
          name: item.name,
          description: item.description,
          calories_per_serving: item.calories_per_serving,
          protein_grams: item.protein_grams,
          carbs_grams: item.carbs_grams,
          fats_grams: item.fats_grams,
          allergens: item.allergens,
          dietary_tags: item.dietary_tags
        });
      
      if (error) {
        console.error(`Error inserting ${item.name}:`, error);
      } else {
        console.log(`✓ Inserted ${item.name} - $${item.price_per_person}pp`);
      }
    }
    
    console.log('Individual pricing setup completed!');
    
  } catch (error) {
    console.error('Failed to add individual pricing:', error);
  }
}

addIndividualPricing();