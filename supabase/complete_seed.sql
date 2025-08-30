-- Athletic Labs Complete Seed Data
-- All 11 menu templates and individual menu items with proper pricing

-- Clear existing data
DELETE FROM order_items;
DELETE FROM orders; 
DELETE FROM menu_items;
DELETE FROM menu_templates;
DELETE FROM team_settings;
DELETE FROM teams;

-- Insert sample teams
INSERT INTO teams (id, name, league, city, nutrition_profile, roster_size, budget_limit) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Los Angeles Lakers', 'NBA', 'Los Angeles', '{"protein": 28, "carbs": 42, "fats": 30}', 15, 15000.00),
  ('550e8400-e29b-41d4-a716-446655440002', 'New York Yankees', 'MLB', 'New York', '{"protein": 25, "carbs": 50, "fats": 25}', 28, 20000.00),
  ('550e8400-e29b-41d4-a716-446655440003', 'Dallas Cowboys', 'NFL', 'Dallas', '{"protein": 30, "carbs": 40, "fats": 30}', 53, 35000.00);

-- Insert all 11 menu templates with exact pricing
INSERT INTO menu_templates (id, name, description, cuisine_type, bundle_price, serves_count, is_active) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'BYO MED BOWL', 'Build Your Own Mediterranean Bowl with fresh ingredients', 'Mediterranean', 29.40, 60, true),
  ('660e8400-e29b-41d4-a716-446655440002', 'BYO BURRITO BOWL', 'Build Your Own Burrito Bowl with Mexican flavors', 'Mexican', 24.00, 60, true),
  ('660e8400-e29b-41d4-a716-446655440003', 'BYO ASIAN BOWL', 'Build Your Own Asian Bowl with authentic Asian ingredients', 'Asian', 26.00, 60, true),
  ('660e8400-e29b-41d4-a716-446655440004', 'BYO PASTA BOWL', 'Build Your Own Pasta Bowl with Italian classics', 'Italian', 22.00, 60, true),
  ('660e8400-e29b-41d4-a716-446655440005', 'TASTE OF MIAMI', 'Authentic Miami flavors with Latin cuisine', 'Latin', 28.40, 60, true),
  ('660e8400-e29b-41d4-a716-446655440006', 'LITTLE ITALY', 'Classic Italian dishes with premium ingredients', 'Italian', 32.00, 60, true),
  ('660e8400-e29b-41d4-a716-446655440007', 'THE CHOPHOUSE', 'Premium steakhouse experience', 'American', 38.00, 60, true),
  ('660e8400-e29b-41d4-a716-446655440008', 'CHEF ADAM EXPERIENCE', 'Signature dishes from Chef Adam', 'Premium', 45.90, 60, true),
  ('660e8400-e29b-41d4-a716-446655440009', 'BREAKFAST ESSENTIALS', 'Essential breakfast items for teams', 'Breakfast', 18.00, 60, true),
  ('660e8400-e29b-41d4-a716-446655440010', 'BREAKFAST SPECIALS GO-TO BRUNCH', 'Special brunch items for weekend meals', 'Breakfast', 22.00, 60, true),
  ('660e8400-e29b-41d4-a716-446655440011', 'BREAKFAST MENU (Specials)', 'Premium breakfast specialties', 'Breakfast', 24.00, 60, true);

-- Insert all individual menu items with proper pricing

-- Premium/Signature Items (for Chef Adam Experience)
INSERT INTO menu_items (template_id, name, description, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('660e8400-e29b-41d4-a716-446655440008', 'Adams Signature Sushi Boat', 'Premium sushi selection crafted by Chef Adam', 450, 35.0, 25.0, 18.0, '{"fish", "soy"}', '{"premium", "signature"}'),
  ('660e8400-e29b-41d4-a716-446655440008', 'Wagyu Denvers', 'Premium Wagyu beef Denver steaks', 680, 52.0, 8.0, 45.0, '{}', '{"premium", "wagyu", "1-fp"}'),
  ('660e8400-e29b-41d4-a716-446655440008', 'Lobster Risotto', 'Creamy lobster risotto with herbs', 620, 28.0, 45.0, 32.0, '{"shellfish", "dairy"}', '{"premium", "1-fp"}'),
  ('660e8400-e29b-41d4-a716-446655440008', 'Miso Glazed Chilean Sea Bass', 'Pan-seared sea bass with miso glaze', 580, 48.0, 12.0, 28.0, '{"fish", "soy"}', '{"premium", "1-fp"}'),
  ('660e8400-e29b-41d4-a716-446655440008', 'Rosemary Dijon Lamb Chops', 'Herb-crusted lamb chops with Dijon mustard', 720, 55.0, 6.0, 48.0, '{}', '{"premium", "1-fp"}');

-- Base Proteins
INSERT INTO menu_items (template_id, name, description, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Chicken Shawarma', 'Middle Eastern spiced chicken shawarma', 485, 42.0, 15.0, 28.0, '{}', '{"halal", "1.5-fp"}'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Asian Braised Salmon', 'Teriyaki glazed salmon with Asian spices', 520, 45.0, 12.0, 32.0, '{"fish", "soy"}', '{"omega-3"}'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Pollo a la Plancha', 'Grilled chicken with Latin spices', 445, 48.0, 8.0, 22.0, '{}', '{"grilled", "1.5-fp"}'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Chimichurri Steak', 'Grilled steak with chimichurri sauce', 625, 52.0, 6.0, 42.0, '{}', '{"grilled", "1.5-fp"}');

-- Base Starches
INSERT INTO menu_items (template_id, name, description, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Saffron Basmati Rice', 'Aromatic saffron-infused basmati rice', 220, 4.0, 45.0, 2.0, '{}', '{"vegan", "2-fp"}'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Jasmine Rice', 'Fragrant jasmine rice perfectly steamed', 205, 4.0, 44.0, 1.0, '{}', '{"vegan", "2-fp"}'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Fresh Baked Pita', 'Warm, fresh-baked pita bread', 165, 5.0, 33.0, 1.5, '{"gluten"}', '{"vegetarian", "60-pieces"}'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Alfredo Sauce', 'Creamy Alfredo sauce for pasta', 280, 8.0, 6.0, 25.0, '{"dairy"}', '{"vegetarian"}');

-- Base Sides/Vegetables
INSERT INTO menu_items (template_id, name, description, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Fresh Hummus', 'Traditional Middle Eastern hummus', 180, 8.0, 15.0, 12.0, '{"sesame"}', '{"vegan", "1-hp"}'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Tahini Roasted Cauliflower', 'Roasted cauliflower with tahini drizzle', 145, 6.0, 12.0, 8.0, '{"sesame"}', '{"vegan", "1-fp"}'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Charred Broccolini', 'Perfectly charred broccolini with garlic', 85, 5.0, 8.0, 3.0, '{}', '{"vegan"}'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Roasted Sweet Plantains', 'Caramelized sweet plantains', 158, 1.0, 40.0, 0.5, '{}', '{"vegan", "1-fp"}');

-- Breakfast Items
INSERT INTO menu_items (template_id, name, description, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('660e8400-e29b-41d4-a716-446655440009', 'Almond na Tigela Acai Bowls', 'Brazilian-style acai bowls with almonds', 320, 8.0, 48.0, 12.0, '{"nuts"}', '{"antioxidant", "superfood"}'),
  ('660e8400-e29b-41d4-a716-446655440009', 'Buttermilk Pancakes', 'Fluffy buttermilk pancakes', 285, 8.0, 45.0, 8.0, '{"gluten", "dairy", "eggs"}', '{"breakfast-classic"}'),
  ('660e8400-e29b-41d4-a716-446655440010', 'Cajeta Churros', 'Mexican churros with cajeta caramel', 245, 4.0, 35.0, 12.0, '{"gluten", "dairy"}', '{"dessert", "mexican"}');

-- Insert team settings
INSERT INTO team_settings (team_id, default_delivery_location, preferred_delivery_times, dietary_restrictions, allergen_alerts, notification_preferences) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Lakers Training Facility - Main Kitchen', '{"11:30:00", "17:00:00"}', '{"vegetarian-options"}', '{"nuts", "shellfish"}', '{"order_confirmations": true, "delivery_updates": true, "menu_updates": true}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Yankee Stadium - Players Lounge', '{"12:00:00", "18:00:00"}', '{}', '{"peanuts"}', '{"order_confirmations": true, "delivery_updates": true, "menu_updates": false}'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Cowboys Training Complex - Nutrition Center', '{"11:00:00", "16:30:00"}', '{"gluten-free-options"}', '{"gluten", "dairy"}', '{"order_confirmations": true, "delivery_updates": true, "menu_updates": true}');

-- Sample order (for testing)
INSERT INTO orders (
  id, 
  order_number, 
  team_id, 
  status, 
  contact_name, 
  contact_phone, 
  contact_email, 
  delivery_date, 
  delivery_time, 
  delivery_location, 
  delivery_instructions, 
  estimated_people_count, 
  subtotal_amount, 
  tax_rate, 
  tax_amount, 
  rush_surcharge, 
  total_amount
) VALUES (
  '770e8400-e29b-41d4-a716-446655440001',
  'AL202408300001',
  '550e8400-e29b-41d4-a716-446655440001',
  'confirmed',
  'Sarah Johnson',
  '(555) 123-4567',
  'sarah.johnson@lakers.com',
  '2024-09-02',
  '11:30:00',
  'Lakers Training Facility - Main Kitchen',
  'Please deliver to kitchen staff entrance',
  28,
  462.50,
  0.0875,
  40.47,
  0.00,
  502.97
);

-- Sample order items
INSERT INTO order_items (order_id, template_id, quantity, unit_price, total_price, special_instructions) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 25, 18.50, 462.50, 'Extra vegetables for 5 vegetarian players');