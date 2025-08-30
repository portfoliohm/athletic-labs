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

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    
    // First, let's see what users exist in auth.users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }
    
    console.log('Found users:', users.length);
    
    if (users.length === 0) {
      console.log('No users found in auth.users');
      return;
    }
    
    // Get the first user (likely yours)
    const user = users[0];
    console.log('User ID:', user.id);
    console.log('User email:', user.email);
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (existingProfile) {
      console.log('Profile exists:', existingProfile);
      
      // Update to admin if not already
      if (existingProfile.role !== 'admin') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating profile to admin:', updateError);
        } else {
          console.log('Updated profile to admin role');
        }
      } else {
        console.log('User is already admin');
      }
    } else {
      console.log('No profile found, creating admin profile...');
      
      // Create admin profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: 'Admin',
          last_name: 'User',
          email: user.email,
          role: 'admin',
          team_id: null
        });
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
      } else {
        console.log('Created admin profile successfully');
      }
    }
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupAdmin();