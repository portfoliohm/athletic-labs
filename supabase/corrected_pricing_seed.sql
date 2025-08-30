-- Athletic Labs Complete Seed Data - CORRECTED PRICING
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

-- Insert all 11 menu templates with CORRECT pricing (per person, serves 60)
INSERT INTO menu_templates (id, name, description, cuisine_type, bundle_price, serves_count, is_active) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'BYO MED BOWL', 'Build Your Own Mediterranean Bowl with fresh ingredients', 'Mediterranean', 49.00, 60, true),
  ('660e8400-e29b-41d4-a716-446655440002', 'BYO BURRITO BOWL', 'Build Your Own Burrito Bowl with Mexican flavors', 'Mexican', 40.00, 60, true),
  ('660e8400-e29b-41d4-a716-446655440003', 'BYO ASIAN BOWL', 'Build Your Own Asian Bowl with authentic Asian ingredients', 'Asian', 43.33, 60, true),
  ('660e8400-e29b-41d4-a716-446655440004', 'BYO PASTA BOWL', 'Build Your Own Pasta Bowl with Italian classics', 'Italian', 36.67, 60, true),
  ('660e8400-e29b-41d4-a716-446655440005', 'TASTE OF MIAMI', 'Authentic Miami flavors with Latin cuisine', 'Latin', 47.33, 60, true),
  ('660e8400-e29b-41d4-a716-446655440006', 'LITTLE ITALY', 'Classic Italian dishes with premium ingredients', 'Italian', 53.33, 60, true),
  ('660e8400-e29b-41d4-a716-446655440007', 'THE CHOPHOUSE', 'Premium steakhouse experience', 'American', 63.33, 60, true),
  ('660e8400-e29b-41d4-a716-446655440008', 'CHEF ADAM EXPERIENCE', 'Signature dishes from Chef Adam', 'Premium', 76.50, 60, true),
  ('660e8400-e29b-41d4-a716-446655440009', 'BREAKFAST ESSENTIALS', 'Essential breakfast items for teams', 'Breakfast', 30.00, 60, true),
  ('660e8400-e29b-41d4-a716-446655440010', 'BREAKFAST SPECIALS GO-TO BRUNCH', 'Special brunch items for weekend meals', 'Breakfast', 36.67, 60, true),
  ('660e8400-e29b-41d4-a716-446655440011', 'BREAKFAST MENU (Specials)', 'Premium breakfast specialties', 'Breakfast', 40.00, 60, true);

-- First, we need to update the menu_items table structure to include individual pricing
-- Add pricing columns to menu_items table
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS price_per_person DECIMAL(8,2);
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS price_half_pan DECIMAL(8,2);  
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS price_full_pan DECIMAL(8,2);
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS section_category VARCHAR(100);
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS notes TEXT;

-- Insert all individual menu items with proper pricing structure

-- Premium/Signature Items (for Chef Adam Experience and available individually)
INSERT INTO menu_items (name, description, section_category, price_per_person, price_half_pan, price_full_pan, notes, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('Adams Signature Sushi Boat', 'Premium sushi selection crafted by Chef Adam', 'Premium/Signature', 38.00, 456.00, 912.00, '', 450, 35.0, 25.0, 18.0, '{"fish", "soy"}', '{"premium", "signature"}'),
  ('Wagyu Denvers', 'Premium Wagyu beef Denver steaks', 'Premium/Signature', 45.00, 540.00, 1080.00, '1 FP', 680, 52.0, 8.0, 45.0, '{}', '{"premium", "wagyu"}'),
  ('Lobster Risotto', 'Creamy lobster risotto with herbs', 'Premium/Signature', 42.00, 504.00, 1008.00, '1 FP', 620, 28.0, 45.0, 32.0, '{"shellfish", "dairy"}', '{"premium"}'),
  ('Miso Glazed Chilean Sea Bass', 'Pan-seared sea bass with miso glaze', 'Premium/Signature', 48.00, 576.00, 1152.00, '1 FP', 580, 48.0, 12.0, 28.0, '{"fish", "soy"}', '{"premium"}'),
  ('Rosemary Dijon Lamb Chops', 'Herb-crusted lamb chops with Dijon mustard', 'Premium/Signature', 44.00, 528.00, 1056.00, '1 FP', 720, 55.0, 6.0, 48.0, '{}', '{"premium"}');

-- Base Proteins
INSERT INTO menu_items (name, description, section_category, price_per_person, price_half_pan, price_full_pan, notes, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('Chicken Shawarma', 'Middle Eastern spiced chicken shawarma', 'Base Proteins', 22.00, 264.00, 528.00, '1.5 FP', 485, 42.0, 15.0, 28.0, '{}', '{"halal"}'),
  ('Asian Braised Salmon', 'Teriyaki glazed salmon with Asian spices', 'Base Proteins', 28.00, 336.00, 672.00, '', 520, 45.0, 12.0, 32.0, '{"fish", "soy"}', '{"omega-3"}'),
  ('Pollo a la Plancha', 'Grilled chicken with Latin spices', 'Base Proteins', 24.00, 288.00, 576.00, '1.5 FP', 445, 48.0, 8.0, 22.0, '{}', '{"grilled"}'),
  ('Chimichurri Steak', 'Grilled steak with chimichurri sauce', 'Base Proteins', 32.00, 384.00, 768.00, '1.5 FP', 625, 52.0, 6.0, 42.0, '{}', '{"grilled"}');

-- Base Starches
INSERT INTO menu_items (name, description, section_category, price_per_person, price_half_pan, price_full_pan, notes, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('Saffron Basmati Rice', 'Aromatic saffron-infused basmati rice', 'Base Starches', 12.00, 144.00, 288.00, '2 FP', 210, 4.0, 45.0, 1.0, '{}', '{"gluten-free"}'),
  ('Jasmine Rice', 'Fragrant jasmine rice', 'Base Starches', 10.00, 120.00, 240.00, '2 FP', 205, 4.0, 44.0, 0.5, '{}', '{"gluten-free", "vegan"}'),
  ('Fresh Baked Pita', 'Warm Mediterranean pita bread', 'Base Starches', 8.00, 96.00, 192.00, '60 pieces', 165, 5.0, 33.0, 1.0, '{"gluten"}', '{"vegetarian"}'),
  ('Alfredo Sauce', 'Creamy alfredo pasta sauce', 'Base Starches', 14.00, 168.00, 336.00, '', 185, 6.0, 8.0, 16.0, '{"dairy"}', '{"vegetarian"}');

-- Base Sides/Vegetables  
INSERT INTO menu_items (name, description, section_category, price_per_person, price_half_pan, price_full_pan, notes, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('Fresh Hummus', 'Traditional Mediterranean hummus', 'Base Sides', 14.00, 168.00, 336.00, '1 HP', 155, 8.0, 14.0, 10.0, '{"sesame"}', '{"vegan", "protein"}'),
  ('Tahini Roasted Cauliflower', 'Roasted cauliflower with tahini dressing', 'Base Sides', 16.00, 192.00, 384.00, '1 FP', 125, 5.0, 12.0, 8.0, '{"sesame"}', '{"vegan"}'),
  ('Charred Broccolini', 'Perfectly charred broccolini with garlic', 'Base Sides', 14.00, 168.00, 336.00, '', 85, 5.0, 8.0, 3.0, '{}', '{"vegan"}'),
  ('Roasted Sweet Plantains', 'Caramelized sweet plantains', 'Base Sides', 18.00, 216.00, 432.00, '1 FP', 158, 1.0, 40.0, 0.5, '{}', '{"vegan"}');

-- Breakfast Items
INSERT INTO menu_items (name, description, section_category, price_per_person, price_half_pan, price_full_pan, notes, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('Almond na Tigela Acai Bowls', 'Brazilian-style acai bowls with almonds', 'Breakfast', 28.00, 336.00, 672.00, '', 320, 8.0, 48.0, 12.0, '{"nuts"}', '{"antioxidant", "superfood"}'),
  ('Buttermilk Pancakes', 'Fluffy buttermilk pancakes', 'Breakfast', 14.00, 168.00, 336.00, '', 285, 8.0, 45.0, 8.0, '{"gluten", "dairy", "eggs"}', '{"breakfast-classic"}'),
  ('Cajeta Churros', 'Mexican churros with cajeta caramel', 'Breakfast', 12.00, 144.00, 288.00, '', 245, 4.0, 35.0, 12.0, '{"gluten", "dairy"}', '{"dessert", "mexican"}');

-- Additional Items to reach 38 total items
INSERT INTO menu_items (name, description, section_category, price_per_person, price_half_pan, price_full_pan, notes, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('Grilled Chicken Breast', 'Herb-seasoned grilled chicken breast', 'Base Proteins', 20.00, 240.00, 480.00, '1.5 FP', 350, 45.0, 0.0, 8.0, '{}', '{"lean", "protein"}'),
  ('Blackened Fish Tacos', 'Spiced fish with fresh slaw', 'Base Proteins', 26.00, 312.00, 624.00, '', 420, 35.0, 25.0, 18.0, '{"fish"}', '{"mexican"}'),
  ('BBQ Pulled Pork', 'Slow-cooked BBQ pulled pork', 'Base Proteins', 24.00, 288.00, 576.00, '1.5 FP', 465, 38.0, 12.0, 25.0, '{}', '{"bbq"}'),
  ('Vegetarian Black Bean Burger', 'Plant-based protein burger', 'Base Proteins', 18.00, 216.00, 432.00, '', 285, 18.0, 35.0, 12.0, '{}', '{"vegetarian", "plant-based"}'),
  ('Wild Rice Pilaf', 'Nutty wild rice with herbs', 'Base Starches', 11.00, 132.00, 264.00, '2 FP', 195, 6.0, 38.0, 2.0, '{}', '{"gluten-free", "whole-grain"}'),
  ('Garlic Mashed Potatoes', 'Creamy garlic mashed potatoes', 'Base Starches', 9.00, 108.00, 216.00, '2 FP', 220, 4.0, 32.0, 8.0, '{"dairy"}', '{"comfort-food"}'),
  ('Quinoa Tabbouleh', 'Mediterranean quinoa salad', 'Base Starches', 13.00, 156.00, 312.00, '2 FP', 185, 6.0, 30.0, 5.0, '{}', '{"gluten-free", "vegan"}'),
  ('Herb Roasted Vegetables', 'Seasonal roasted vegetables with herbs', 'Base Sides', 15.00, 180.00, 360.00, '1 FP', 110, 4.0, 18.0, 4.0, '{}', '{"vegan", "seasonal"}'),
  ('Caesar Salad', 'Classic Caesar salad with croutons', 'Base Sides', 12.00, 144.00, 288.00, '', 185, 8.0, 12.0, 14.0, '{"dairy", "anchovies"}', '{"classic"}'),
  ('Greek Salad', 'Traditional Greek salad with feta', 'Base Sides', 14.00, 168.00, 336.00, '', 165, 6.0, 10.0, 12.0, '{"dairy"}', '{"mediterranean"}'),
  ('Avocado Lime Crema', 'Fresh avocado crema with lime', 'Base Sides', 10.00, 120.00, 240.00, '1 HP', 125, 2.0, 6.0, 12.0, '{}', '{"vegan", "healthy-fats"}'),
  ('Cilantro Lime Rice', 'Fresh cilantro and lime jasmine rice', 'Base Starches', 11.00, 132.00, 264.00, '2 FP', 200, 4.0, 42.0, 1.0, '{}', '{"vegan", "fresh"}'),
  ('Teriyaki Glazed Vegetables', 'Asian vegetables with teriyaki glaze', 'Base Sides', 16.00, 192.00, 384.00, '1 FP', 120, 4.0, 20.0, 3.0, '{"soy"}', '{"asian", "glazed"}'),
  ('Coconut Rice', 'Fragrant coconut jasmine rice', 'Base Starches', 12.00, 144.00, 288.00, '2 FP', 235, 4.0, 38.0, 8.0, '{}', '{"tropical", "vegan"}'),
  ('Mediterranean Orzo', 'Orzo pasta with Mediterranean herbs', 'Base Starches', 13.00, 156.00, 312.00, '2 FP', 210, 7.0, 40.0, 3.0, '{"gluten"}', '{"mediterranean"}'),
  ('Grilled Asparagus', 'Simply grilled asparagus spears', 'Base Sides', 18.00, 216.00, 432.00, '1 FP', 95, 4.0, 8.0, 1.0, '{}', '{"vegan", "spring"}'),
  ('Sweet Potato Fries', 'Crispy sweet potato fries', 'Base Sides', 14.00, 168.00, 336.00, '1 FP', 180, 3.0, 35.0, 6.0, '{}', '{"vegan"}'),
  ('Caprese Skewers', 'Fresh mozzarella, tomato, and basil', 'Base Sides', 16.00, 192.00, 384.00, '', 145, 8.0, 6.0, 10.0, '{"dairy"}', '{"vegetarian", "fresh"}'),
  ('Bacon Wrapped Scallops', 'Pan-seared scallops wrapped in bacon', 'Premium/Signature', 42.00, 504.00, 1008.00, '1 FP', 320, 25.0, 3.0, 22.0, '{"shellfish"}', '{"premium"}'),
  ('Truffle Mac and Cheese', 'Gourmet mac and cheese with truffle oil', 'Premium/Signature', 28.00, 336.00, 672.00, '1 FP', 485, 18.0, 38.0, 28.0, '{"gluten", "dairy"}', '{"premium", "truffle"}'),
  ('Fresh Fruit Platter', 'Seasonal fresh fruit selection', 'Base Sides', 12.00, 144.00, 288.00, '1 HP', 85, 1.0, 22.0, 0.5, '{}', '{"vegan", "fresh", "seasonal"}'),
  ('Artisan Bread Rolls', 'Fresh baked artisan bread rolls', 'Base Starches', 8.00, 96.00, 192.00, '60 pieces', 155, 5.0, 30.0, 2.0, '{"gluten"}', '{"artisan"}'),
  ('Grilled Vegetable Medley', 'Seasonal grilled vegetables', 'Base Sides', 15.00, 180.00, 360.00, '1 FP', 105, 4.0, 15.0, 4.0, '{}', '{"vegan", "grilled"}'),
  ('Pesto Pasta Salad', 'Fresh pasta salad with basil pesto', 'Base Starches', 14.00, 168.00, 336.00, '2 FP', 245, 8.0, 32.0, 12.0, '{"gluten", "nuts"}', '{"vegetarian"}'),
  ('Honey Glazed Carrots', 'Sweet honey glazed baby carrots', 'Base Sides', 12.00, 144.00, 288.00, '1 FP', 115, 2.0, 24.0, 3.0, '{}', '{"vegetarian", "sweet"}'),
  ('Spanish Rice', 'Traditional Spanish rice with spices', 'Base Starches', 11.00, 132.00, 264.00, '2 FP', 195, 4.0, 40.0, 2.0, '{}', '{"vegan", "spanish"}'),
  ('Roasted Brussels Sprouts', 'Caramelized Brussels sprouts with bacon', 'Base Sides', 16.00, 192.00, 384.00, '1 FP', 165, 8.0, 12.0, 10.0, '{}', '{"bacon"}'),
  ('Garlic Bread', 'Buttery garlic bread slices', 'Base Starches', 9.00, 108.00, 216.00, '60 pieces', 185, 5.0, 28.0, 6.0, '{"gluten", "dairy"}', '{"classic"}');

-- Insert team settings
INSERT INTO team_settings (team_id, default_delivery_location, preferred_delivery_times, dietary_restrictions, allergen_alerts, notification_preferences) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Lakers Training Facility - Main Kitchen', '{"11:30:00", "17:00:00"}', '{"vegetarian-options"}', '{"nuts", "shellfish"}', '{"order_confirmations": true, "delivery_updates": true, "menu_updates": true}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Yankee Stadium - Players Lounge', '{"12:00:00", "18:00:00"}', '{}', '{"peanuts"}', '{"order_confirmations": true, "delivery_updates": true, "menu_updates": false}'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Cowboys Training Complex - Nutrition Center', '{"11:00:00", "16:30:00"}', '{"gluten-free-options"}', '{"gluten", "dairy"}', '{"order_confirmations": true, "delivery_updates": true, "menu_updates": true}');