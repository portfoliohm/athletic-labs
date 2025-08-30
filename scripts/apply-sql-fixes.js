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

async function applySqlFixes() {
  try {
    console.log('Applying SQL fixes...');
    
    const fixesPath = path.join(__dirname, '..', 'supabase', 'fix_auth_issues.sql');
    const sqlContent = fs.readFileSync(fixesPath, 'utf8');
    
    // Split SQL into individual statements and execute them
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 100) + '...');
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error('Error executing statement:', error);
          // Try using direct query for simpler statements
          const { error: directError } = await supabase.from('information_schema.tables').select('*').limit(1);
          if (directError) {
            console.error('Direct query also failed:', directError);
          }
        } else {
          console.log('✓ Statement executed successfully');
        }
      }
    }
    
    console.log('SQL fixes completed');
    
  } catch (error) {
    console.error('Failed to apply fixes:', error);
  }
}

applySqlFixes();