#!/usr/bin/env node

/**
 * Simple Node.js runner for the Customer Insight Generator
 * Handles TypeScript compilation and execution
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file if it exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

function main() {
  console.log('🔍 Lint Insights Generator');
  console.log('=' .repeat(50));

  // Get organization ID from command line
  const organizationId = process.argv[2];
  
  if (!organizationId) {
    console.error('❌ Error: Organization ID is required');
    console.log('\nUsage:');
    console.log('  npm run generate-insights <organization-id>');
    console.log('  node scripts/run-insight-generator.js <organization-id>');
    console.log('\nExample:');
    console.log('  npm run generate-insights org_123456789');
    process.exit(1);
  }

  // Check environment variables
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY environment variable is required');
    console.log('\nPlease set your Claude API key:');
    console.log('  export ANTHROPIC_API_KEY=your_api_key_here');
    console.log('\nOr create a .env file with:');
    console.log('  ANTHROPIC_API_KEY=your_api_key_here');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is required');
    console.log('\nPlease set your database connection string:');
    console.log('  export DATABASE_URL=your_database_url_here');
    process.exit(1);
  }

  try {
    console.log(`📋 Organization ID: ${organizationId}`);
    console.log('🔧 Compiling TypeScript...');

    // Compile TypeScript file
    const tsFile = path.join(__dirname, 'customer-insight-generator.ts');
    const jsFile = path.join(__dirname, 'customer-insight-generator.js');

    execSync(`npx tsc ${tsFile} --outDir ${__dirname} --module commonjs --target es2020 --moduleResolution node --esModuleInterop --allowSyntheticDefaultImports --skipLibCheck`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    console.log('✅ Compilation successful!');
    console.log('🚀 Starting insight generation...');
    console.log('');

    // Execute the compiled JavaScript
    execSync(`node ${jsFile} ${organizationId}`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      env: { ...process.env }
    });

    // Cleanup compiled file
    if (fs.existsSync(jsFile)) {
      fs.unlinkSync(jsFile);
    }

  } catch (error) {
    console.error('❌ Error running insight generator:', error.message);
    
    // Cleanup compiled file on error
    const jsFile = path.join(__dirname, 'customer-insight-generator.js');
    if (fs.existsSync(jsFile)) {
      fs.unlinkSync(jsFile);
    }
    
    process.exit(1);
  }
}

main();