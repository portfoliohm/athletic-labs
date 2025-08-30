-- Athletic Labs Seed Data
-- Sample data for development and testing

-- Insert sample teams
INSERT INTO teams (id, name, league, city, nutrition_profile, roster_size, budget_limit) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Los Angeles Lakers', 'NBA', 'Los Angeles', '{"protein": 28, "carbs": 42, "fats": 30}', 15, 15000.00),
  ('550e8400-e29b-41d4-a716-446655440002', 'New York Yankees', 'MLB', 'New York', '{"protein": 25, "carbs": 50, "fats": 25}', 28, 20000.00),
  ('550e8400-e29b-41d4-a716-446655440003', 'Dallas Cowboys', 'NFL', 'Dallas', '{"protein": 30, "carbs": 40, "fats": 30}', 53, 35000.00);

-- Insert sample menu templates
INSERT INTO menu_templates (id, name, description, cuisine_type, bundle_price, serves_count, is_active) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Power Performance Bundle', 'High-protein meals designed for peak athletic performance', 'American', 18.50, 25, true),
  ('660e8400-e29b-41d4-a716-446655440002', 'Recovery Nutrition Pack', 'Balanced post-workout meals for optimal recovery', 'Mediterranean', 16.75, 25, true),
  ('660e8400-e29b-41d4-a716-446655440003', 'Game Day Fuel', 'Pre-competition meals for sustained energy', 'International', 19.25, 25, true),
  ('660e8400-e29b-41d4-a716-446655440004', 'Lean & Clean Bundle', 'Low-calorie, nutrient-dense options for cutting phases', 'Health-Conscious', 15.50, 25, true),
  ('660e8400-e29b-41d4-a716-446655440005', 'Bulk Builder Pack', 'High-calorie meals for strength and mass building', 'American', 21.00, 25, true);

-- Insert sample menu items for Power Performance Bundle
INSERT INTO menu_items (template_id, name, description, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Grilled Chicken & Sweet Potato', 'Lean grilled chicken breast with roasted sweet potato and steamed broccoli', 520, 45.5, 38.2, 12.8, '{}', '{"gluten-free", "dairy-free"}'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Salmon Power Bowl', 'Atlantic salmon with quinoa, avocado, and mixed vegetables', 580, 42.0, 35.5, 22.5, '{"fish"}', '{"omega-3", "gluten-free"}'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Turkey & Brown Rice', 'Lean ground turkey with brown rice pilaf and green beans', 485, 38.0, 42.0, 14.5, '{}', '{"high-protein", "whole-grain"}');

-- Insert sample menu items for Recovery Nutrition Pack
INSERT INTO menu_items (template_id, name, description, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('660e8400-e29b-41d4-a716-446655440002', 'Mediterranean Chicken Bowl', 'Herb-marinated chicken with couscous, cucumber, and tzatziki', 495, 35.0, 45.0, 16.5, '{"dairy", "gluten"}', '{"mediterranean", "anti-inflammatory"}'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Greek Yogurt Power Parfait', 'Greek yogurt with berries, granola, and honey', 320, 18.0, 48.0, 8.5, '{"dairy", "nuts"}', '{"probiotic", "antioxidant-rich"}'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Quinoa Tabbouleh Salad', 'Fresh quinoa salad with herbs, tomatoes, and olive oil', 385, 12.0, 52.0, 15.0, '{}', '{"vegan", "gluten-free", "fiber-rich"}');

-- Insert sample menu items for Game Day Fuel
INSERT INTO menu_items (template_id, name, description, calories_per_serving, protein_grams, carbs_grams, fats_grams, allergens, dietary_tags) VALUES
  ('660e8400-e29b-41d4-a716-446655440003', 'Pre-Game Pasta Power', 'Whole grain pasta with lean beef and marinara sauce', 625, 38.0, 75.0, 18.0, '{"gluten"}', '{"sustained-energy", "carb-loading"}'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Energy Smoothie Bowl', 'Banana and berry smoothie bowl with granola and nuts', 440, 15.0, 68.0, 14.5, '{"nuts", "dairy"}', '{"quick-energy", "natural-sugars"}'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Champion Wrap', 'Grilled chicken wrap with hummus and vegetables', 515, 32.0, 45.0, 18.5, '{"gluten"}', '{"portable", "balanced-macro"}');

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

-- Create admin user profile (placeholder - will be created via auth signup)
-- This is just for reference structure
-- INSERT INTO profiles (id, first_name, last_name, email, role, team_id) VALUES
--   ('admin-user-id-here', 'Athletic', 'Labs', 'admin@athleticlabs.com', 'admin', NULL);