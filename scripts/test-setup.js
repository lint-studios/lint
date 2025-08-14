#!/usr/bin/env node

/**
 * Test script to verify the Customer Insight Generator setup
 * Checks environment variables, database connection, and dependencies
 */

const fs = require('fs');
const path = require('path');

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');
  
  const required = ['ANTHROPIC_API_KEY', 'DATABASE_URL'];
  const missing = [];
  
  required.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    } else {
      console.log(`✅ ${varName}: Set`);
    }
  });
  
  if (missing.length > 0) {
    console.log('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\nPlease check your .env file or environment setup.');
    return false;
  }
  
  return true;
}

function checkDependencies() {
  console.log('\n🔍 Checking dependencies...');
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.log('❌ package.json not found');
    return false;
  }
  
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('❌ node_modules not found. Run: npm install');
    return false;
  }
  
  const requiredPackages = [
    '@prisma/client',
    'typescript',
    '@types/node'
  ];
  
  let allInstalled = true;
  
  requiredPackages.forEach(pkg => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`✅ ${pkg}: Installed`);
    } else {
      console.log(`❌ ${pkg}: Missing`);
      allInstalled = false;
    }
  });
  
  return allInstalled;
}

function checkFiles() {
  console.log('\n🔍 Checking required files...');
  
  const requiredFiles = [
    { path: 'scripts/customer-insight-generator.ts', name: 'Main generator script' },
    { path: 'scripts/run-insight-generator.js', name: 'Runner script' },
    { path: 'src/lib/prisma.ts', name: 'Prisma client' },
    { path: 'prisma/schema.prisma', name: 'Database schema' }
  ];
  
  let allPresent = true;
  
  requiredFiles.forEach(({ path: filePath, name }) => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${name}: Found`);
    } else {
      console.log(`❌ ${name}: Missing (${filePath})`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

function checkCompanyProfile() {
  console.log('\n🔍 Checking company profiles directory...');
  
  const profileDir = '/Users/annabellegartner/Desktop/company_profiles/';
  
  if (fs.existsSync(profileDir)) {
    console.log('✅ Company profiles directory: Found');
    console.log('   ℹ️  Company-specific profiles are optional - system uses generic template as fallback');
    return true;
  } else {
    console.log('ℹ️  Company profiles directory: Not found (optional)');
    console.log('   System will use generic company template for all organizations');
    return true; // This is not a failure since profiles are optional
  }
}

async function testDatabaseConnection() {
  console.log('\n🔍 Testing database connection...');
  
  try {
    // Import Prisma client dynamically
    const { prisma } = require('../src/lib/prisma.ts');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection: Successful');
    
    // Test reviews table
    const reviewCount = await prisma.review.count();
    console.log(`✅ Reviews table: Accessible (${reviewCount} total reviews)`);
    
    await prisma.$disconnect();
    return true;
    
  } catch (error) {
    console.log('❌ Database connection: Failed');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

function showUsageInstructions() {
  console.log('\n📋 Usage Instructions:');
  console.log('1. Ensure all checks above pass ✅');
  console.log('2. Get your organization ID from the user');
  console.log('3. Run the generator:');
  console.log('   npm run generate-insights <organization-id>');
  console.log('');
  console.log('Example:');
  console.log('   npm run generate-insights org_luna_sleep_co_123');
  console.log('');
  console.log('📁 Reports will be saved to: ./reports/');
  console.log('💰 Expected value: $50+ worth of actionable insights');
}

async function main() {
  console.log('🔍 Lint Insights Generator - Setup Test');
  console.log('=' .repeat(60));
  
  const checks = [
    checkEnvironmentVariables(),
    checkDependencies(),
    checkFiles(),
    checkCompanyProfile()
  ];
  
  // Test database connection asynchronously
  let dbCheck = false;
  try {
    dbCheck = await testDatabaseConnection();
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  }
  
  const allPassed = checks.every(check => check) && dbCheck;
  
  console.log('\n' + '=' .repeat(60));
  
  if (allPassed) {
    console.log('🎉 All checks passed! Ready to generate insights.');
    showUsageInstructions();
  } else {
    console.log('❌ Some checks failed. Please fix the issues above.');
    console.log('');
    console.log('Common fixes:');
    console.log('- Run: npm install');
    console.log('- Set environment variables in .env file');
    console.log('- Ensure database is running and accessible');
    console.log('- Check file paths and permissions');
  }
  
  console.log('');
}

// Load environment variables from .env file if it exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

main().catch(console.error);