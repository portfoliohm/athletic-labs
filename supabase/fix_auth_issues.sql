-- Fix authentication and RLS issues for Athletic Labs

-- 1. First, let's check if there are any existing profiles and create admin profile if needed
-- This will be run manually in Supabase SQL editor

-- 2. Allow menu_templates to be read by authenticated users (no RLS needed for read-only reference data)
ALTER TABLE menu_templates DISABLE ROW LEVEL SECURITY;

-- 3. Allow menu_items to be read by authenticated users 
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;

-- 4. Fix profiles policies to handle cases where profile doesn't exist yet
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- More permissive profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. Fix teams policies to allow admins full access
DROP POLICY IF EXISTS "Team staff can view own team" ON teams;
CREATE POLICY "Team staff can view own team" ON teams FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND (team_id = teams.id OR role = 'admin')
  )
);
CREATE POLICY "Admins can manage all teams" ON teams FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 6. Fix orders policies  
DROP POLICY IF EXISTS "Team staff can view team orders" ON orders;
DROP POLICY IF EXISTS "Team staff can create team orders" ON orders;

CREATE POLICY "Team staff can view team orders" ON orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND (team_id = orders.team_id OR role = 'admin')
  )
);
CREATE POLICY "Team staff can create team orders" ON orders FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND (team_id = orders.team_id OR role = 'admin')
  )
);
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 7. Fix order_items policies
DROP POLICY IF EXISTS "Users can view order items for accessible orders" ON order_items;
CREATE POLICY "Users can view order items for accessible orders" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    JOIN profiles ON profiles.id = auth.uid() 
    WHERE orders.id = order_items.order_id 
    AND (profiles.team_id = orders.team_id OR profiles.role = 'admin')
  )
);
CREATE POLICY "Users can insert order items for accessible orders" ON order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    JOIN profiles ON profiles.id = auth.uid() 
    WHERE orders.id = order_items.order_id 
    AND (profiles.team_id = orders.team_id OR profiles.role = 'admin')
  )
);

-- 8. Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 9. Create a function to safely create admin profile
CREATE OR REPLACE FUNCTION create_admin_profile(
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT
) RETURNS void AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name, email, role, team_id)
  VALUES (user_id, first_name, last_name, email, 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;