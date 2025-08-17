#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const prisma = new PrismaClient();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showUsage() {
  console.log(`
📊 Interactive Report Upload Script

Usage:
  node scripts/upload-report.js <report-file>

The script will guide you through:
  - Selecting an organization
  - Entering a Google Drive URL (optional)
  - Customizing report details (optional)

Example:
  node scripts/upload-report.js reports/my-report.json
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    showUsage();
    process.exit(0);
  }

  const reportFile = args[0];
  return { reportFile };
}

// Helper function to prompt user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Function to select organization interactively
async function selectOrganization() {
  console.log('\n🏢 Fetching organizations...');
  
  const organizations = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      industry: true,
      platform: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  if (organizations.length === 0) {
    console.log('❌ No organizations found in database.');
    console.log('💡 You need to create an organization first.');
    process.exit(1);
  }

  console.log('\n📋 Available Organizations:');
  organizations.forEach((org, index) => {
    console.log(`${index + 1}. ${org.name}`);
    console.log(`   ID: ${org.id}`);
    console.log(`   Industry: ${org.industry || 'N/A'}`);
    console.log(`   Platform: ${org.platform || 'N/A'}`);
    console.log('');
  });

  let selectedOrg;
  while (!selectedOrg) {
    const answer = await askQuestion(`Please select an organization (1-${organizations.length}): `);
    const selection = parseInt(answer);
    
    if (selection >= 1 && selection <= organizations.length) {
      selectedOrg = organizations[selection - 1];
      console.log(`\n✅ Selected: ${selectedOrg.name} (${selectedOrg.id})`);
    } else {
      console.log('❌ Invalid selection. Please try again.');
    }
  }

  return selectedOrg;
}

// Function to get additional details interactively
async function getReportDetails(reportData) {
  console.log('\n📝 Report Configuration:');
  
  // Google Drive URL
  const googleDriveUrl = await askQuestion('\n🔗 Google Drive URL (optional, press Enter to skip): ');
  
  // Report type
  console.log('\n📊 Report Type Options:');
  console.log('1. Custom (default)');
  console.log('2. Monthly');
  console.log('3. Weekly');
  
  const typeAnswer = await askQuestion('Select report type (1-3, default: 1): ') || '1';
  const reportTypeMap = { '1': 'custom', '2': 'monthly', '3': 'weekly' };
  const reportType = reportTypeMap[typeAnswer] || 'custom';
  
  // Custom title and subtitle
  const defaultTitle = generateTitle(reportData, reportData.metadata || {});
  const defaultSubtitle = generateSubtitle(reportData, reportData.metadata || {});
  
  console.log(`\n📄 Default title: "${defaultTitle}"`);
  const customTitle = await askQuestion('Custom title (press Enter to use default): ');
  
  console.log(`📄 Default subtitle: "${defaultSubtitle}"`);
  const customSubtitle = await askQuestion('Custom subtitle (press Enter to use default): ');

  return {
    googleDriveUrl: googleDriveUrl.trim() || null,
    reportType,
    title: customTitle.trim() || null,
    subtitle: customSubtitle.trim() || null
  };
}

function extractReportData(reportData, options) {
  const metadata = reportData.metadata || {};
  const executiveSummary = reportData.executiveSummary || {};
  
  // Extract highlights from executive summary
  const highlights = {
    keyFindings: executiveSummary.keyFindings || [],
    sentimentOverview: executiveSummary.sentimentOverview || {},
    topThemes: executiveSummary.topThemes || [],
    criticalIssues: executiveSummary.criticalIssues || [],
    opportunities: executiveSummary.opportunities || []
  };

  // Calculate analytics from the data
  const sourcesCount = reportData.sources ? Object.keys(reportData.sources).length : 1;
  const productsAnalyzed = reportData.productAnalysis ? Object.keys(reportData.productAnalysis).length : 0;
  const reviewsAnalyzed = metadata.totalReviews || 0;
  const sentimentScore = executiveSummary.sentimentOverview?.averageRating || null;

  // Generate title and subtitle if not provided
  const title = options.title || generateTitle(reportData, metadata);
  const subtitle = options.subtitle || generateSubtitle(reportData, metadata);

  // Extract date range
  const dateRange = metadata.dateRange || {};
  const reportStartDate = dateRange.start ? new Date(dateRange.start) : new Date();
  const reportEndDate = dateRange.end ? new Date(dateRange.end) : new Date();

  return {
    title,
    subtitle,
    reportStartDate,
    reportEndDate,
    highlights,
    sourcesCount,
    productsAnalyzed,
    reviewsAnalyzed,
    sentimentScore,
    metadata: reportData
  };
}

function generateTitle(reportData, metadata) {
  const orgName = metadata.organizationName || 'Customer';
  return `${orgName} Insights Report`;
}

function generateSubtitle(reportData, metadata) {
  const dateRange = metadata.dateRange || {};
  if (dateRange.start && dateRange.end) {
    const startDate = new Date(dateRange.start).toLocaleDateString();
    const endDate = new Date(dateRange.end).toLocaleDateString();
    return `Review Analysis for ${startDate} - ${endDate}`;
  }
  return `Generated on ${new Date().toLocaleDateString()}`;
}

async function uploadReport() {
  try {
    const { reportFile } = parseArgs();

    // Validate file exists
    if (!fs.existsSync(reportFile)) {
      console.error(`❌ Report file not found: ${reportFile}`);
      process.exit(1);
    }

    console.log(`📁 Reading report file: ${reportFile}`);
    
    // Read and parse JSON file
    let reportData;
    try {
      const fileContent = fs.readFileSync(reportFile, 'utf8');
      reportData = JSON.parse(fileContent);
    } catch (error) {
      console.error(`❌ Invalid JSON file: ${error.message}`);
      process.exit(1);
    }

    console.log(`✅ Report file loaded successfully`);

    // Interactive organization selection
    const organization = await selectOrganization();
    
    // Interactive report details configuration
    const userOptions = await getReportDetails(reportData);

    // Extract data from JSON
    const extractedData = extractReportData(reportData, userOptions);

    console.log(`\n📊 Creating report...`);
    console.log(`   Organization: ${organization.name}`);
    console.log(`   Title: ${extractedData.title}`);
    console.log(`   Subtitle: ${extractedData.subtitle}`);
    console.log(`   Type: ${userOptions.reportType}`);
    console.log(`   Reviews: ${extractedData.reviewsAnalyzed}`);
    console.log(`   Sentiment: ${extractedData.sentimentScore || 'N/A'}`);
    console.log(`   Google Drive: ${userOptions.googleDriveUrl || 'Not provided'}`);

    // Confirm before uploading
    const confirm = await askQuestion('\n❓ Proceed with upload? (y/N): ');
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('❌ Upload cancelled by user');
      process.exit(0);
    }

    // Create the report entry
    const report = await prisma.report.create({
      data: {
        organizationId: organization.id,
        title: extractedData.title,
        subtitle: extractedData.subtitle,
        status: 'ready',
        reportType: userOptions.reportType,
        reportStartDate: extractedData.reportStartDate,
        reportEndDate: extractedData.reportEndDate,
        googleDriveUrl: userOptions.googleDriveUrl,
        highlights: extractedData.highlights,
        metadata: extractedData.metadata,
        sourcesCount: extractedData.sourcesCount,
        productsAnalyzed: extractedData.productsAnalyzed,
        reviewsAnalyzed: extractedData.reviewsAnalyzed,
        sentimentScore: extractedData.sentimentScore,
        downloadCount: 0
      }
    });

    console.log(`\n✅ Report uploaded successfully!`);
    console.log(`📋 Report Details:`);
    console.log(`   ID: ${report.id}`);
    console.log(`   Organization: ${organization.name} (${report.organizationId})`);
    console.log(`   Title: ${report.title}`);
    console.log(`   Subtitle: ${report.subtitle}`);
    console.log(`   Status: ${report.status}`);
    console.log(`   Type: ${report.reportType}`);
    console.log(`   Date Range: ${report.reportStartDate.toISOString().split('T')[0]} to ${report.reportEndDate.toISOString().split('T')[0]}`);
    console.log(`   Reviews Analyzed: ${report.reviewsAnalyzed}`);
    console.log(`   Products Analyzed: ${report.productsAnalyzed}`);
    console.log(`   Sources: ${report.sourcesCount}`);
    console.log(`   Sentiment Score: ${report.sentimentScore || 'N/A'}`);
    console.log(`   Google Drive: ${report.googleDriveUrl || 'Not provided'}`);
    console.log(`   Created: ${report.createdAt}`);

    return report;

  } catch (error) {
    console.error('❌ Error uploading report:', error);
    throw error;
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Run the upload if called directly
if (require.main === module) {
  uploadReport()
    .then(() => {
      console.log('\n🎉 Upload completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Upload failed:', error.message);
      process.exit(1);
    });
}

module.exports = { uploadReport };
