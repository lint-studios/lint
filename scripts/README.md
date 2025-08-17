# Lint Insights Generator

A comprehensive AI-powered customer insight report generator that analyzes review data for any organization to provide actionable business intelligence worth $50+ in value.

## Features

🤖 **AI-Powered Analysis**
- Semantic clustering of reviews using Claude AI
- Advanced sentiment analysis with confidence scores
- Theme extraction and pattern identification

📊 **Comprehensive Insights**
- Customer feedback clustering (5-8 meaningful segments)
- Product mentions and feature request identification
- Competitive intelligence and positioning opportunities
- Pain point analysis and risk assessment

📈 **Marketing Intelligence**
- Ready-to-use marketing copy hooks from customer language
- Facebook/Instagram ad copy suggestions
- Content marketing themes and ideas
- Complete August 2025 marketing calendar

🎯 **Actionable Recommendations**
- Immediate actions (30 days) with priority levels
- Short-term improvements (90 days)
- Long-term strategic initiatives (6-12 months)
- Specific success metrics for each recommendation

📄 **Professional Reports**
- Detailed Markdown report for stakeholders
- Structured JSON data for further analysis
- Executive summary with key findings
- $50+ value proposition with clear ROI

## Prerequisites

1. **Environment Variables**
   ```bash
   export ANTHROPIC_API_KEY="your_claude_api_key"
   export DATABASE_URL="your_postgresql_database_url"
   ```

2. **Database Setup**
   - PostgreSQL database with reviews table
   - Prisma client configured and migrated
   - Organization ID for the company

3. **Dependencies**
   - Node.js 18+
   - TypeScript
   - All npm packages installed

## Quick Start

### 1. Set Environment Variables

Create a `.env` file in the project root:

```bash
# Claude AI API Key (required)
ANTHROPIC_API_KEY=your_claude_api_key_here

# Database connection (required)
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DIRECT_URL=postgresql://username:password@localhost:5432/database_name

# Optional: Custom output directory
REPORTS_OUTPUT_DIR=./custom-reports
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Generator

```bash
# Using npm script (recommended)
npm run generate-insights-simple <organization-id> [context-file-path]

# Or directly
node scripts/run-insight-generator-simple.js <organization-id> [context-file-path]
```

**Examples:**
```bash
# Use generic company template
npm run generate-insights-simple org_your_company_123

# Use specific company context file
npm run generate-insights-simple org_your_company_123 /path/to/company-profile.txt
```

## Usage

### Command Line

```bash
# Generate report for any organization
npm run generate-insights-simple org_your_company_123 /path/to/company-profile.txt

# The script will:
# 1. Ask for organization ID (provided as argument)
# 2. Fetch reviews from database using the org_id
# 3. Analyze reviews with Claude AI
# 4. Generate comprehensive report
# 5. Save both Markdown and JSON versions
```

### Programmatic Usage

```typescript
import { generateCustomerInsightReport } from './scripts/customer-insight-generator';

// Generate report
await generateCustomerInsightReport('org_luna_sleep_co_123');
```

## Output

The generator creates two files in the `./reports` directory:

1. **Markdown Report** (`{company-name}-insights-YYYY-MM-DD-HH-mm-ss.md`)
   - Human-readable executive summary
   - Detailed cluster analysis
   - Marketing recommendations
   - Actionable next steps

2. **JSON Report** (`{company-name}-insights-YYYY-MM-DD-HH-mm-ss.json`)
   - Structured data for further analysis
   - API integration ready
   - All raw analysis results

## Report Structure

### Executive Summary
- 5 key business findings
- Sentiment overview with distribution
- Top customer themes
- Critical issues requiring attention
- Growth opportunities

### Cluster Analysis
Each cluster includes:
- Descriptive name and detailed description
- Sentiment scores and confidence levels
- Key themes and patterns
- Product mentions and feature requests
- Customer pain points
- Competitive mentions
- Marketing-ready language hooks

### Marketing Intelligence
- 10 powerful copy hooks from customer language
- 5 Facebook/Instagram ad variations
- 8 content marketing themes
- Complete 31-day August 2025 marketing calendar

### Competitive Analysis
- Direct competitor mentions and context
- Positioning opportunities vs. competitors
- Key differentiators to emphasize

### Product Insights
- Top-performing products by sentiment
- Specific improvement suggestions
- New product opportunities from customer requests

### Risk Assessment
- Business risks identified from feedback
- Severity and probability ratings
- Specific mitigation strategies

### Actionable Recommendations
Three priority tiers:
- **Immediate** (30 days): Quick wins and urgent fixes
- **Short-term** (90 days): Process improvements
- **Long-term** (6-12 months): Strategic initiatives

## Company Context

The generator automatically loads company context from:

1. **Database Organization Data**: Name, industry, platform info
2. **Optional Company Profiles**: Custom profiles in `/company_profiles/` directory
3. **Generic Template**: Fallback template for universal applicability

The system adapts prompts and analysis based on available company information.

## API Integration

### Claude AI Configuration
- Model: `claude-3-5-sonnet-20241022`
- Temperature: 0.3 (balanced creativity/consistency)
- Max tokens: 4000 per request
- Multiple API calls for comprehensive analysis

### Database Schema
Reviews table structure:
```sql
Review {
  id                 String   @id @default(cuid())
  organizationId     String
  externalId         String
  productId          String?
  productTitle       String?
  rating             Int
  title              String?
  body               String
  reviewerName       String?
  reviewerEmail      String?
  createdAtRemote    DateTime
  verified           Boolean?
  source             String   @default("judgeme")
  // ... additional fields
}
```

## Error Handling

The system includes comprehensive error handling:

- **Database Connection**: Validates connection and schema
- **API Errors**: Handles Claude API rate limits and failures
- **Data Validation**: Ensures review data quality
- **File Operations**: Manages report saving and directory creation
- **Environment Setup**: Validates required environment variables

## Performance

- **Review Capacity**: Handles 1,000+ reviews efficiently
- **Processing Time**: ~2-5 minutes for typical datasets
- **Memory Usage**: Optimized for large review datasets
- **API Efficiency**: Batched requests to minimize costs

## Troubleshooting

### Common Issues

1. **Missing API Key**
   ```
   Error: ANTHROPIC_API_KEY environment variable is required
   ```
   Solution: Set your Claude API key in environment variables

2. **Database Connection Failed**
   ```
   Error: Failed to fetch reviews from database
   ```
   Solution: Check DATABASE_URL and ensure database is accessible

3. **No Reviews Found**
   ```
   Error: No reviews found for the specified organization ID
   ```
   Solution: Verify the organization ID and ensure reviews exist

4. **TypeScript Compilation Error**
   ```
   Error: Cannot find module '@prisma/client'
   ```
   Solution: Run `npm install` and `npx prisma generate`

### Debug Mode

Set environment variable for verbose logging:
```bash
export DEBUG=true
npm run generate-insights org_id
```

## Value Proposition

This report generator provides **$50+ worth of value** through:

1. **Time Savings**: Automated analysis vs. manual review reading (10+ hours)
2. **AI Insights**: Advanced semantic analysis beyond simple ratings
3. **Marketing Intelligence**: Ready-to-use copy and campaign ideas
4. **Strategic Planning**: Prioritized roadmap with success metrics
5. **Competitive Edge**: Data-driven positioning opportunities
6. **Risk Mitigation**: Proactive issue identification and solutions

## Future Enhancements

- Multi-language review analysis
- Integration with additional review platforms
- Automated monthly report scheduling
- Dashboard visualization of insights
- A/B testing recommendations
- Predictive churn analysis

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review environment variable setup
3. Ensure all dependencies are installed
4. Verify database connectivity and schema

## Report Upload Script

### `upload-report.js` - Interactive Report Upload

Upload customer insight reports to the database with an interactive interface.

**Usage:**
```bash
node scripts/upload-report.js <report-file.json>
```

**Features:**
- 🏢 **Organization Selection**: Choose from available organizations in your database
- 🔗 **Google Drive Integration**: Add Google Drive URLs for document access
- 📊 **Report Type Options**: Select monthly, weekly, or custom report types
- 📝 **Custom Titles**: Override default titles and subtitles
- ✅ **Confirmation**: Preview before uploading with confirmation prompt
- 🎯 **Smart Extraction**: Automatically extracts analytics from JSON data

**Interactive Flow:**
1. Select organization from list
2. Enter Google Drive URL (optional)
3. Choose report type (monthly/weekly/custom)
4. Customize title/subtitle (optional)
5. Review details and confirm upload

**Example:**
```bash
node scripts/upload-report.js reports/luna-sleep-co-insights-2025-08-14T01-18-59.json
```

**Data Extraction:**
The script automatically extracts:
- Key findings and insights from `executiveSummary`
- Analytics data (reviews analyzed, sentiment score, etc.)
- Date ranges from `metadata`
- Highlights and critical issues
- Complete metadata preservation

## License

Private - Lint Insights Generator
Built for lint-studio-mvp project