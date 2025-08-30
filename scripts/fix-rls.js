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

async function fixRLS() {
  try {
    console.log('Fixing RLS policies...');
    
    // Test basic connectivity first
    console.log('Testing connection...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id, role')
      .limit(1);
    
    if (testError) {
      console.error('Connection test failed:', testError);
      return;
    }
    
    console.log('Connection successful, found profiles:', testData);
    
    // Check if menu_templates are accessible
    console.log('Testing menu_templates access...');
    const { data: templatesData, error: templatesError } = await supabase
      .from('menu_templates')
      .select('id, name')
      .limit(1);
    
    if (templatesError) {
      console.error('Templates access failed:', templatesError);
    } else {
      console.log('Templates accessible:', templatesData);
    }
    
    // Check if teams are accessible
    console.log('Testing teams access...');
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('id, name')
      .limit(1);
    
    if (teamsError) {
      console.error('Teams access failed:', teamsError);
    } else {
      console.log('Teams accessible:', teamsData);
    }
    
    // Check if orders are accessible  
    console.log('Testing orders access...');
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
    
    if (ordersError) {
      console.error('Orders access failed:', ordersError);
    } else {
      console.log('Orders accessible:', ordersData);
    }
    
    console.log('RLS test completed');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

fixRLS();