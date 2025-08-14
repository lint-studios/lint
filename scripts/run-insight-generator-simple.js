#!/usr/bin/env node

/**
 * Simple runner for the Customer Insight Generator using ts-node
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

  // Get organization ID and optional context file path from command line
  const organizationId = process.argv[2];
  const contextFilePath = process.argv[3];
  
  if (!organizationId) {
    console.error('❌ Error: Organization ID is required');
    console.log('\nUsage:');
    console.log('  npm run generate-insights-simple <organization-id> [context-file-path]');
    console.log('\nExamples:');
    console.log('  npm run generate-insights-simple org_123456789');
    console.log('  npm run generate-insights-simple org_123456789 /path/to/company-profile.txt');
    process.exit(1);
  }

  // Check environment variables
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY environment variable is required');
    console.log('\nPlease set your Claude API key in the .env file');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is required');
    console.log('\nPlease set your database connection string in the .env file');
    process.exit(1);
  }

  try {
    console.log(`📋 Organization ID: ${organizationId}`);
    if (contextFilePath) {
      console.log(`📄 Context File: ${contextFilePath}`);
    }
    console.log('🚀 Starting insight generation with ts-node...');
    console.log('');

    // Execute TypeScript directly with ts-node
    const tsFile = path.join(__dirname, 'customer-insight-generator.ts');
    const command = contextFilePath 
      ? `npx ts-node --project ${path.join(__dirname, 'tsconfig.json')} ${tsFile} ${organizationId} "${contextFilePath}"`
      : `npx ts-node --project ${path.join(__dirname, 'tsconfig.json')} ${tsFile} ${organizationId}`;
    
    execSync(command, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      env: { 
        ...process.env
      }
    });

  } catch (error) {
    console.error('❌ Error running insight generator:', error.message);
    process.exit(1);
  }
}

main();