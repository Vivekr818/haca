#!/usr/bin/env node

/**
 * Test runner for edge case tests
 * Checks environment setup before running tests
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment setup...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.error('❌ .env.local file not found\n');
  console.log('📋 Setup Instructions:');
  console.log('1. Create a .env.local file in the project root');
  console.log('2. Add your Supabase credentials:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.log('\n3. Get these values from:');
  console.log('   https://app.supabase.com → Your Project → Settings → API\n');
  console.log('📖 See lib/E2E_TEST_README.md for detailed setup instructions\n');
  process.exit(1);
}

// Load environment variables
require('dotenv').config({ path: envPath });

// Check if required variables are set
const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:\n');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.log('\n📖 See lib/E2E_TEST_README.md for setup instructions\n');
  process.exit(1);
}

console.log('✅ Environment configured\n');
console.log('🚀 Running edge case tests...\n');

try {
  execSync('npx tsx lib/e2e-edge-cases.test.ts', {
    stdio: 'inherit',
    env: process.env
  });
} catch (error) {
  process.exit(error.status || 1);
}
