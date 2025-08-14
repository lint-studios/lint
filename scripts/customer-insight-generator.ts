/**
 * Lint Insights Generator
 * 
 * This script generates comprehensive customer insight reports using Claude AI
 * to analyze review data and provide actionable business recommendations for any organization.
 * 
 * Features:
 * - Semantic clustering of reviews using Claude AI
 * - Sentiment analysis and theme extraction
 * - Product mentions and feature request identification
 * - Competitive analysis and positioning insights
 * - Marketing copy suggestions and recommendations
 * - Monthly marketing calendar generation
 * - Risk mitigation strategies
 */

import { prisma } from '../src/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

// Types for our analysis
interface Review {
  id: string;
  organizationId: string;
  externalId: string;
  productId: string | null;
  productTitle: string | null;
  rating: number;
  title: string | null;
  body: string;
  reviewerName: string | null;
  reviewerEmail: string | null;
  createdAtRemote: Date;
  updatedAtRemote: Date | null;
  publishedAtRemote: Date | null;
  verified: boolean | null;
  helpful: number;
  source: string;
  productExternalId: string | null;
  productHandle: string | null;
  media: any;
  raw: any;
  createdAt: Date;
  updatedAt: Date;
}

interface ClusterAnalysis {
  clusterId: string;
  clusterName: string;
  description: string;
  reviewIds: string[];
  sentiment: {
    overall: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
  };
  themes: string[];
  productMentions: string[];
  featureRequests: string[];
  painPoints: string[];
  competitorMentions: string[];
  marketingHooks: string[];
}

interface CompanyContext {
  name: string;
  mission: string;
  values: string[];
  products: any[];
  targetCustomers: any[];
  competitors: any[];
  businessGoals: any[];
  challenges: any[];
  currentMetrics: any;
}

interface InsightReport {
  metadata: {
    generatedAt: Date;
    organizationId: string;
    totalReviews: number;
    dateRange: {
      start: Date;
      end: Date;
    };
    reportVersion: string;
  };
  executiveSummary: {
    keyFindings: string[];
    sentimentOverview: any;
    topThemes: string[];
    criticalIssues: string[];
    opportunities: string[];
  };
  clusters: ClusterAnalysis[];
  marketingInsights: {
    copyHooks: string[];
    adCopySuggestions: string[];
    contentThemes: string[];
    augustCalendar: any[];
  };
  competitiveIntelligence: {
    mentions: any[];
    positioningOpportunities: string[];
    differentiators: string[];
  };
  productInsights: {
    topProducts: any[];
    improvementSuggestions: string[];
    newProductOpportunities: string[];
  };
  riskMitigation: {
    risks: any[];
    mitigationStrategies: string[];
  };
  actionableRecommendations: {
    immediate: any[];
    shortTerm: any[];
    longTerm: any[];
  };
}

class LintInsightsGenerator {
  private companyContext: CompanyContext;
  private claudeApiKey: string;

  constructor(companyContext: CompanyContext, claudeApiKey?: string) {
    this.companyContext = companyContext;
    this.claudeApiKey = claudeApiKey || process.env.ANTHROPIC_API_KEY || '';
    
    if (!this.claudeApiKey) {
      throw new Error('Claude API key is required. Set ANTHROPIC_API_KEY environment variable.');
    }
  }

  /**
   * Main method to generate comprehensive customer insight report
   */
  async generateReport(organizationId: string): Promise<InsightReport> {
    console.log('🚀 Starting customer insight report generation...');
    
    try {
      // Step 1: Fetch reviews from database
      console.log('📊 Fetching reviews from database...');
      const reviews = await this.fetchReviews(organizationId);
      console.log(`✅ Found ${reviews.length} reviews`);

      if (reviews.length === 0) {
        throw new Error('No reviews found for the specified organization ID');
      }

      // Step 2: Perform Claude AI clustering analysis
      console.log('🤖 Performing AI clustering and sentiment analysis...');
      const clusters = await this.performClusteringAnalysis(reviews);
      console.log(`✅ Identified ${clusters.length} distinct clusters`);

      // Step 3: Generate marketing insights
      console.log('📈 Generating marketing insights and recommendations...');
      const marketingInsights = await this.generateMarketingInsights(clusters, reviews);

      // Step 4: Competitive intelligence analysis
      console.log('🏆 Analyzing competitive intelligence...');
      const competitiveIntelligence = await this.analyzeCompetitiveIntelligence(clusters, reviews);

      // Step 5: Product insights and opportunities
      console.log('🛍️ Extracting product insights...');
      const productInsights = await this.generateProductInsights(clusters, reviews);

      // Step 6: Risk analysis and mitigation
      console.log('⚠️ Performing risk analysis...');
      const riskMitigation = await this.analyzeRisks(clusters, reviews);

      // Step 7: Generate actionable recommendations
      console.log('🎯 Creating actionable recommendations...');
      const recommendations = await this.generateRecommendations(clusters, marketingInsights, productInsights);

      // Step 8: Create executive summary
      console.log('📋 Compiling executive summary...');
      const executiveSummary = await this.createExecutiveSummary(clusters, reviews);

      // Compile final report
      const report: InsightReport = {
        metadata: {
          generatedAt: new Date(),
          organizationId,
          totalReviews: reviews.length,
          dateRange: {
            start: new Date(Math.min(...reviews.map(r => r.createdAtRemote.getTime()))),
            end: new Date(Math.max(...reviews.map(r => r.createdAtRemote.getTime())))
          },
          reportVersion: '1.0.0'
        },
        executiveSummary,
        clusters,
        marketingInsights,
        competitiveIntelligence,
        productInsights,
        riskMitigation,
        actionableRecommendations: recommendations
      };

      console.log('✅ Customer insight report generation completed!');
      return report;

    } catch (error) {
      console.error('❌ Error generating customer insight report:', error);
      throw error;
    }
  }

  /**
   * Fetch reviews from database for the specified organization
   */
  private async fetchReviews(organizationId: string): Promise<Review[]> {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          organizationId: organizationId
        },
        orderBy: {
          createdAtRemote: 'desc'
        }
      });

      return reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Failed to fetch reviews from database');
    }
  }

  /**
   * Use Claude AI to perform semantic clustering and sentiment analysis
   */
  private async performClusteringAnalysis(reviews: Review[]): Promise<ClusterAnalysis[]> {
    const reviewTexts = reviews.map(r => ({
      id: r.id,
      text: `${r.title || ''} ${r.body}`.trim(),
      rating: r.rating,
      productTitle: r.productTitle || 'Unknown Product'
    }));

    const prompt = `You are an expert customer insight analyst specializing in e-commerce and consumer products. 

Company Context:
${JSON.stringify(this.companyContext, null, 2)}

Analyze the following ${reviews.length} customer reviews for Luna Sleep Co. and perform semantic clustering to identify distinct themes and patterns.

Reviews Data:
${JSON.stringify(reviewTexts, null, 2)}

Please perform the following analysis:

1. **Semantic Clustering**: Group reviews into 5-8 meaningful clusters based on semantic similarity, themes, and customer intent. Each cluster should represent a distinct aspect of customer experience.

2. **Sentiment Analysis**: For each cluster, provide sentiment analysis including overall sentiment (positive/negative/neutral), numerical score (1-10), and confidence level.

3. **Theme Extraction**: Identify key themes, topics, and patterns within each cluster.

4. **Product Analysis**: Extract specific product mentions, feature requests, and improvement suggestions.

5. **Pain Point Identification**: Identify customer pain points, complaints, and friction areas.

6. **Competitive Intelligence**: Look for mentions of competitors, comparisons, or switching behaviors.

7. **Marketing Hook Extraction**: Identify powerful customer language that could be used for marketing copy and testimonials.

Return your analysis in this exact JSON format:
{
  "clusters": [
    {
      "clusterId": "unique_id",
      "clusterName": "descriptive_name",
      "description": "detailed_description",
      "reviewIds": ["id1", "id2"],
      "sentiment": {
        "overall": "positive|negative|neutral",
        "score": number_1_to_10,
        "confidence": number_0_to_1
      },
      "themes": ["theme1", "theme2"],
      "productMentions": ["product1", "product2"],
      "featureRequests": ["request1", "request2"],
      "painPoints": ["pain1", "pain2"],
      "competitorMentions": ["competitor1"],
      "marketingHooks": ["hook1", "hook2"]
    }
  ]
}

Focus on actionable insights that can drive business decisions. Be specific and detailed in your analysis.`;

    try {
      const response = await this.callClaudeAPI(prompt);
      const parsed = JSON.parse(response);
      return parsed.clusters;
    } catch (error) {
      console.error('Error in clustering analysis:', error);
      throw new Error('Failed to perform clustering analysis');
    }
  }

  /**
   * Generate marketing insights and August 2025 calendar
   */
  private async generateMarketingInsights(clusters: ClusterAnalysis[], reviews: Review[]): Promise<any> {
    const prompt = `Based on the clustering analysis and Luna Sleep Co.'s business context, generate comprehensive marketing insights.

Company Context:
${JSON.stringify(this.companyContext, null, 2)}

Cluster Analysis:
${JSON.stringify(clusters, null, 2)}

Generate:

1. **Copy Hooks**: 10 powerful marketing hooks derived from actual customer language
2. **Ad Copy Suggestions**: 5 Facebook/Instagram ad copy variations with headlines and body text
3. **Content Themes**: 8 content marketing themes for blog posts and social media
4. **August 2025 Marketing Calendar**: 31-day calendar with specific daily actions, post ideas, and campaigns

Consider Luna Sleep Co.'s goals:
- $5M ARR target by end of 2025
- 40% repeat purchase rate goal
- Focus on sustainable sleepwear for women 25-45
- Addressing size inclusivity and customer acquisition challenges

Return in JSON format:
{
  "copyHooks": ["hook1", "hook2"],
  "adCopySuggestions": [
    {
      "headline": "headline_text",
      "bodyText": "body_text",
      "cta": "call_to_action",
      "targetAudience": "audience_description"
    }
  ],
  "contentThemes": ["theme1", "theme2"],
  "augustCalendar": [
    {
      "date": "2025-08-01",
      "action": "specific_action",
      "content": "content_description",
      "platform": "platform_name",
      "notes": "additional_notes"
    }
  ]
}`;

    try {
      const response = await this.callClaudeAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating marketing insights:', error);
      throw new Error('Failed to generate marketing insights');
    }
  }

  /**
   * Analyze competitive intelligence and positioning opportunities
   */
  private async analyzeCompetitiveIntelligence(clusters: ClusterAnalysis[], reviews: Review[]): Promise<any> {
    const prompt = `Analyze competitive intelligence from customer reviews for Luna Sleep Co.

Company Context:
${JSON.stringify(this.companyContext, null, 2)}

Cluster Analysis:
${JSON.stringify(clusters, null, 2)}

Analyze:
1. Direct and indirect competitor mentions
2. Customer switching behaviors and reasons
3. Competitive advantages and differentiators
4. Positioning opportunities against competitors
5. Gaps in the market that Luna Sleep Co. can exploit

Return in JSON format:
{
  "mentions": [
    {
      "competitor": "competitor_name",
      "mentionType": "positive|negative|neutral",
      "context": "mention_context",
      "frequency": number,
      "insights": ["insight1", "insight2"]
    }
  ],
  "positioningOpportunities": ["opportunity1", "opportunity2"],
  "differentiators": ["differentiator1", "differentiator2"]
}`;

    try {
      const response = await this.callClaudeAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing competitive intelligence:', error);
      throw new Error('Failed to analyze competitive intelligence');
    }
  }

  /**
   * Generate product insights and improvement suggestions
   */
  private async generateProductInsights(clusters: ClusterAnalysis[], reviews: Review[]): Promise<any> {
    const prompt = `Generate product insights for Luna Sleep Co. based on customer feedback.

Company Context:
${JSON.stringify(this.companyContext, null, 2)}

Cluster Analysis:
${JSON.stringify(clusters, null, 2)}

Analyze:
1. Top-performing products based on customer feedback
2. Specific product improvement suggestions
3. New product opportunities based on customer requests
4. Size and fit issues that need addressing
5. Fabric and material feedback

Focus on actionable product development recommendations.

Return in JSON format:
{
  "topProducts": [
    {
      "productName": "product_name",
      "positiveScore": number,
      "keyStrengths": ["strength1", "strength2"],
      "improvementAreas": ["area1", "area2"]
    }
  ],
  "improvementSuggestions": ["suggestion1", "suggestion2"],
  "newProductOpportunities": ["opportunity1", "opportunity2"]
}`;

    try {
      const response = await this.callClaudeAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating product insights:', error);
      throw new Error('Failed to generate product insights');
    }
  }

  /**
   * Analyze risks and mitigation strategies
   */
  private async analyzeRisks(clusters: ClusterAnalysis[], reviews: Review[]): Promise<any> {
    const prompt = `Identify business risks and mitigation strategies for Luna Sleep Co.

Company Context:
${JSON.stringify(this.companyContext, null, 2)}

Cluster Analysis:
${JSON.stringify(clusters, null, 2)}

Identify:
1. Customer satisfaction risks
2. Product quality risks
3. Brand reputation risks
4. Operational risks based on customer feedback
5. Specific mitigation strategies for each risk

Return in JSON format:
{
  "risks": [
    {
      "riskType": "risk_category",
      "description": "risk_description",
      "severity": "high|medium|low",
      "probability": "high|medium|low",
      "impact": "impact_description"
    }
  ],
  "mitigationStrategies": ["strategy1", "strategy2"]
}`;

    try {
      const response = await this.callClaudeAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing risks:', error);
      throw new Error('Failed to analyze risks');
    }
  }

  /**
   * Generate actionable recommendations with priority levels
   */
  private async generateRecommendations(clusters: ClusterAnalysis[], marketingInsights: any, productInsights: any): Promise<any> {
    const prompt = `Generate prioritized, actionable recommendations for Luna Sleep Co.

Company Context:
${JSON.stringify(this.companyContext, null, 2)}

Analysis Data:
Clusters: ${JSON.stringify(clusters, null, 2)}
Marketing Insights: ${JSON.stringify(marketingInsights, null, 2)}
Product Insights: ${JSON.stringify(productInsights, null, 2)}

Create specific, actionable recommendations in three categories:

1. **Immediate Actions** (Next 30 days): High-impact, quick wins
2. **Short-term Actions** (Next 90 days): Medium complexity improvements
3. **Long-term Actions** (Next 6-12 months): Strategic initiatives

Each recommendation should include:
- Specific action
- Expected impact
- Resources required
- Success metrics
- Priority level (1-5)

Return in JSON format:
{
  "immediate": [
    {
      "action": "specific_action",
      "impact": "expected_impact",
      "resources": "resources_needed",
      "metrics": "success_metrics",
      "priority": number_1_to_5
    }
  ],
  "shortTerm": [...],
  "longTerm": [...]
}`;

    try {
      const response = await this.callClaudeAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  /**
   * Create executive summary with key findings
   */
  private async createExecutiveSummary(clusters: ClusterAnalysis[], reviews: Review[]): Promise<any> {
    const sentimentCounts = {
      positive: clusters.filter(c => c.sentiment.overall === 'positive').length,
      negative: clusters.filter(c => c.sentiment.overall === 'negative').length,
      neutral: clusters.filter(c => c.sentiment.overall === 'neutral').length
    };

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const prompt = `Create an executive summary for Luna Sleep Co.'s customer insight report.

Company Context:
${JSON.stringify(this.companyContext, null, 2)}

Data Summary:
- Total Reviews: ${reviews.length}
- Average Rating: ${avgRating.toFixed(2)}
- Sentiment Distribution: ${JSON.stringify(sentimentCounts)}
- Clusters Identified: ${clusters.length}

Cluster Analysis:
${JSON.stringify(clusters, null, 2)}

Create a compelling executive summary that includes:
1. Top 5 key findings that matter to business success
2. Sentiment overview with actionable insights
3. Top themes that emerged from customer feedback
4. Critical issues requiring immediate attention
5. Top opportunities for growth and improvement

Return in JSON format:
{
  "keyFindings": ["finding1", "finding2", "finding3", "finding4", "finding5"],
  "sentimentOverview": {
    "averageRating": ${avgRating.toFixed(2)},
    "distribution": ${JSON.stringify(sentimentCounts)},
    "insights": ["insight1", "insight2"]
  },
  "topThemes": ["theme1", "theme2", "theme3"],
  "criticalIssues": ["issue1", "issue2"],
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"]
}`;

    try {
      const response = await this.callClaudeAPI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error creating executive summary:', error);
      throw new Error('Failed to create executive summary');
    }
  }

  /**
   * Call Claude API with the given prompt
   */
  private async callClaudeAPI(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  /**
   * Save report to both Markdown and JSON formats
   */
  async saveReport(report: InsightReport, companyName: string, outputDir: string = './reports'): Promise<void> {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const sanitizedCompanyName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const baseFilename = `${sanitizedCompanyName}-insights-${timestamp}`;

      // Save JSON version
      const jsonPath = path.join(outputDir, `${baseFilename}.json`);
      await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), 'utf8');

      // Save Markdown version
      const markdownPath = path.join(outputDir, `${baseFilename}.md`);
      const markdownContent = this.generateMarkdownReport(report);
      await fs.writeFile(markdownPath, markdownContent, 'utf8');

      console.log(`✅ Reports saved:`);
      console.log(`   📄 JSON: ${jsonPath}`);
      console.log(`   📝 Markdown: ${markdownPath}`);

    } catch (error) {
      console.error('Error saving reports:', error);
      throw new Error('Failed to save reports');
    }
  }

  /**
   * Generate formatted Markdown report
   */
  private generateMarkdownReport(report: InsightReport): string {
    const { metadata, executiveSummary, clusters, marketingInsights, competitiveIntelligence, productInsights, riskMitigation, actionableRecommendations } = report;

    return `# ${this.companyContext.name} Customer Insight Report

**Generated:** ${metadata.generatedAt.toLocaleDateString()}  
**Organization ID:** ${metadata.organizationId}  
**Total Reviews Analyzed:** ${metadata.totalReviews}  
**Date Range:** ${metadata.dateRange.start.toLocaleDateString()} - ${metadata.dateRange.end.toLocaleDateString()}  
**Report Version:** ${metadata.reportVersion}

---

## Executive Summary

### Key Findings
${executiveSummary.keyFindings.map((finding, i) => `${i + 1}. ${finding}`).join('\n')}

### Sentiment Overview
- **Average Rating:** ${executiveSummary.sentimentOverview.averageRating}/5.0
- **Sentiment Distribution:** 
  - Positive: ${executiveSummary.sentimentOverview.distribution.positive} clusters
  - Negative: ${executiveSummary.sentimentOverview.distribution.negative} clusters
  - Neutral: ${executiveSummary.sentimentOverview.distribution.neutral} clusters

${executiveSummary.sentimentOverview.insights.map((insight: string) => `- ${insight}`).join('\n')}

### Top Themes
${executiveSummary.topThemes.map((theme, i) => `${i + 1}. ${theme}`).join('\n')}

### Critical Issues
${executiveSummary.criticalIssues.map(issue => `⚠️ ${issue}`).join('\n')}

### Top Opportunities
${executiveSummary.opportunities.map(opportunity => `🚀 ${opportunity}`).join('\n')}

---

## Cluster Analysis

${clusters.map((cluster, i) => `
### ${i + 1}. ${cluster.clusterName}

**Description:** ${cluster.description}

**Sentiment:** ${cluster.sentiment.overall.toUpperCase()} (Score: ${cluster.sentiment.score}/10, Confidence: ${Math.round(cluster.sentiment.confidence * 100)}%)

**Key Themes:**
${cluster.themes.map(theme => `- ${theme}`).join('\n')}

**Product Mentions:**
${cluster.productMentions.map(product => `- ${product}`).join('\n')}

**Feature Requests:**
${cluster.featureRequests.map(request => `- ${request}`).join('\n')}

**Pain Points:**
${cluster.painPoints.map(pain => `- ${pain}`).join('\n')}

**Competitor Mentions:**
${cluster.competitorMentions.map(comp => `- ${comp}`).join('\n')}

**Marketing Hooks:**
${cluster.marketingHooks.map(hook => `- "${hook}"`).join('\n')}

**Reviews in Cluster:** ${cluster.reviewIds.length}
`).join('\n')}

---

## Marketing Insights

### Copy Hooks
${marketingInsights.copyHooks.map((hook, i) => `${i + 1}. "${hook}"`).join('\n')}

### Ad Copy Suggestions
${marketingInsights.adCopySuggestions.map((ad: any, i: number) => `
#### Ad ${i + 1}
**Headline:** ${ad.headline}  
**Body:** ${ad.bodyText}  
**CTA:** ${ad.cta}  
**Target:** ${ad.targetAudience}
`).join('\n')}

### Content Themes for August 2025
${marketingInsights.contentThemes.map((theme, i) => `${i + 1}. ${theme}`).join('\n')}

### August 2025 Marketing Calendar (Sample Week)
${marketingInsights.augustCalendar.slice(0, 7).map(day => `
**${day.date}**  
Action: ${day.action}  
Content: ${day.content}  
Platform: ${day.platform}  
${day.notes ? `Notes: ${day.notes}` : ''}
`).join('\n')}

---

## Competitive Intelligence

### Competitor Mentions
${competitiveIntelligence.mentions.map(mention => `
#### ${mention.competitor}
- **Mention Type:** ${mention.mentionType}
- **Frequency:** ${mention.frequency} times
- **Context:** ${mention.context}
- **Insights:** ${mention.insights.join(', ')}
`).join('\n')}

### Positioning Opportunities
${competitiveIntelligence.positioningOpportunities.map(opp => `- ${opp}`).join('\n')}

### Key Differentiators
${competitiveIntelligence.differentiators.map(diff => `- ${diff}`).join('\n')}

---

## Product Insights

### Top Performing Products
${productInsights.topProducts.map(product => `
#### ${product.productName}
- **Positive Score:** ${product.positiveScore}/10
- **Key Strengths:** ${product.keyStrengths.join(', ')}
- **Improvement Areas:** ${product.improvementAreas.join(', ')}
`).join('\n')}

### Product Improvement Suggestions
${productInsights.improvementSuggestions.map((suggestion, i) => `${i + 1}. ${suggestion}`).join('\n')}

### New Product Opportunities
${productInsights.newProductOpportunities.map((opportunity, i) => `${i + 1}. ${opportunity}`).join('\n')}

---

## Risk Mitigation

### Identified Risks
${riskMitigation.risks.map(risk => `
#### ${risk.riskType}
- **Description:** ${risk.description}
- **Severity:** ${risk.severity}
- **Probability:** ${risk.probability}
- **Impact:** ${risk.impact}
`).join('\n')}

### Mitigation Strategies
${riskMitigation.mitigationStrategies.map((strategy, i) => `${i + 1}. ${strategy}`).join('\n')}

---

## Actionable Recommendations

### Immediate Actions (Next 30 Days)
${actionableRecommendations.immediate.map((rec, i) => `
#### ${i + 1}. ${rec.action} (Priority: ${rec.priority}/5)
- **Expected Impact:** ${rec.impact}
- **Resources Required:** ${rec.resources}
- **Success Metrics:** ${rec.metrics}
`).join('\n')}

### Short-term Actions (Next 90 Days)
${actionableRecommendations.shortTerm.map((rec, i) => `
#### ${i + 1}. ${rec.action} (Priority: ${rec.priority}/5)
- **Expected Impact:** ${rec.impact}
- **Resources Required:** ${rec.resources}
- **Success Metrics:** ${rec.metrics}
`).join('\n')}

### Long-term Actions (Next 6-12 Months)
${actionableRecommendations.longTerm.map((rec, i) => `
#### ${i + 1}. ${rec.action} (Priority: ${rec.priority}/5)
- **Expected Impact:** ${rec.impact}
- **Resources Required:** ${rec.resources}
- **Success Metrics:** ${rec.metrics}
`).join('\n')}

---

## Report Value Statement

This comprehensive customer insight report provides $50+ worth of value through:

1. **AI-Powered Analysis**: Advanced semantic clustering and sentiment analysis
2. **Actionable Insights**: Specific recommendations with priority levels and success metrics
3. **Marketing Intelligence**: Ready-to-use copy hooks and campaign ideas
4. **Competitive Analysis**: Strategic positioning opportunities
5. **Product Development**: Data-driven improvement suggestions
6. **Risk Management**: Proactive issue identification and mitigation strategies

**Next Steps:** Review recommendations with your team and implement immediate actions within 30 days for maximum impact.

---

*Generated by Luna Sleep Co. Customer Insight Generator v${metadata.reportVersion}*
*Powered by Claude AI and customer review analysis*
`;
  }
}

// Load company context from provided file path
async function loadCompanyContext(organizationId: string, contextFilePath?: string): Promise<CompanyContext> {
  try {
    // First, get organization details from database
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!organization) {
      throw new Error(`Organization with ID ${organizationId} not found`);
    }

    // If context file path is provided, use it
    if (contextFilePath) {
      try {
        const content = await fs.readFile(contextFilePath, 'utf8');
        console.log(`📄 Using company profile from: ${contextFilePath}`);
        
        // Parse the company profile content - you can enhance this parser as needed
        // For now, we'll extract basic info and use a structured approach
        const companyName = organization.name;
        
        return {
          name: companyName,
          mission: extractFromContent(content, "Mission", "To deliver exceptional customer experiences through high-quality products and services."),
          values: extractListFromContent(content, "Values", [
            "Customer Satisfaction: Putting customers first in every decision",
            "Quality Excellence: Maintaining high standards across all offerings", 
            "Innovation: Continuously improving products and services",
            "Integrity: Building trust through transparent business practices"
          ]),
          products: extractProductsFromContent(content),
          targetCustomers: extractCustomersFromContent(content),
          competitors: extractCompetitorsFromContent(content),
          businessGoals: extractListFromContent(content, "Goals", [
            "Increase customer satisfaction and retention",
            "Expand market presence and brand recognition",
            "Optimize operational efficiency and profitability",
            "Drive sustainable business growth"
          ]),
          challenges: extractListFromContent(content, "Challenge", [
            "Customer Acquisition: Efficiently reaching and converting prospects",
            "Competition: Differentiating in competitive market landscape", 
            "Customer Experience: Meeting evolving customer expectations",
            "Market Dynamics: Adapting to changing market conditions"
          ]),
          currentMetrics: extractMetricsFromContent(content)
        };
      } catch (error) {
        console.log(`⚠️  Could not read context file, using database info: ${error.message}`);
      }
    }

    // Fallback to generic template using database organization data
    console.log(`📝 Using generic template for ${organization.name}`);
    return {
      name: organization.name,
      mission: "To deliver exceptional customer experiences through high-quality products and services.",
      values: [
        "Customer Satisfaction: Putting customers first in every decision",
        "Quality Excellence: Maintaining high standards across all offerings", 
        "Innovation: Continuously improving products and services",
        "Integrity: Building trust through transparent business practices"
      ],
      products: [
        { name: "Core Product Line", price: 0, collection: "Main" }
      ],
      targetCustomers: [
        { persona: "Primary Customer", demographics: "Varied demographics", percentage: 100 }
      ],
      competitors: [
        { name: "Market Competitors", positioning: "Various market positions", priceRange: "Competitive pricing" }
      ],
      businessGoals: [
        "Increase customer satisfaction and retention",
        "Expand market presence and brand recognition",
        "Optimize operational efficiency and profitability",
        "Drive sustainable business growth"
      ],
      challenges: [
        "Customer Acquisition: Efficiently reaching and converting prospects",
        "Competition: Differentiating in competitive market landscape", 
        "Customer Experience: Meeting evolving customer expectations",
        "Market Dynamics: Adapting to changing market conditions"
      ],
      currentMetrics: {
        monthlyRevenue: 0,
        averageOrderValue: 0,
        customerAcquisitionCost: 0,
        customerLifetimeValue: 0,
        grossMargin: 0,
        returnRate: 0
      }
    };
  } catch (error) {
    console.error('Error loading company context:', error);
    throw new Error('Failed to load company context');
  }
}

// Helper functions to extract information from company profile content
function extractFromContent(content: string, section: string, defaultValue: string): string {
  // Simple extraction - you can make this more sophisticated
  const regex = new RegExp(`${section}.*?:\\s*(.+?)(?=\\n|$)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : defaultValue;
}

function extractListFromContent(content: string, section: string, defaultList: string[]): string[] {
  // Extract bullet points or numbered lists for the section
  const sectionRegex = new RegExp(`${section}[^\\n]*\\n([\\s\\S]*?)(?=\\n[A-Z]|$)`, 'i');
  const match = content.match(sectionRegex);
  
  if (match) {
    const lines = match[1].split('\n').filter(line => line.trim().startsWith('*') || line.trim().startsWith('-') || /^\d+\./.test(line.trim()));
    if (lines.length > 0) {
      return lines.map(line => line.replace(/^[\s*\-\d\.]+/, '').trim()).filter(item => item.length > 0);
    }
  }
  
  return defaultList;
}

function extractProductsFromContent(content: string): any[] {
  // Extract product information - simplified for now
  return [{ name: "Core Product Line", price: 0, collection: "Main" }];
}

function extractCustomersFromContent(content: string): any[] {
  // Extract customer segments - simplified for now
  return [{ persona: "Primary Customer", demographics: "Varied demographics", percentage: 100 }];
}

function extractCompetitorsFromContent(content: string): any[] {
  // Extract competitor information - simplified for now
  return [{ name: "Market Competitors", positioning: "Various market positions", priceRange: "Competitive pricing" }];
}

function extractMetricsFromContent(content: string): any {
  // Extract current metrics - simplified for now
  return {
    monthlyRevenue: 0,
    averageOrderValue: 0,
    customerAcquisitionCost: 0,
    customerLifetimeValue: 0,
    grossMargin: 0,
    returnRate: 0
  };
}

// Main execution function
export async function generateInsightReport(organizationId: string, contextFilePath?: string): Promise<void> {
  try {
    console.log('🔍 Lint Insights Generator');
    console.log('=' .repeat(50));

    // Load company context
    const companyContext = await loadCompanyContext(organizationId, contextFilePath);
    
    // Initialize generator
    const generator = new LintInsightsGenerator(companyContext);
    
    // Generate report
    const report = await generator.generateReport(organizationId);
    
    // Save reports with organization name
    await generator.saveReport(report, companyContext.name);
    
    console.log('\n🎉 Report generation completed successfully!');
    console.log(`📊 Analyzed ${report.metadata.totalReviews} reviews for ${companyContext.name}`);
    console.log(`🎯 Identified ${report.clusters.length} customer insight clusters`);
    console.log('💰 Report value: $50+ worth of actionable insights');
    
  } catch (error) {
    console.error('\n❌ Report generation failed:', error);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  const organizationId = process.argv[2];
  const contextFilePath = process.argv[3];
  
  if (!organizationId) {
    console.error('❌ Error: Organization ID is required');
    console.log('Usage: node customer-insight-generator.js <organization-id> [context-file-path]');
    console.log('');
    console.log('Examples:');
    console.log('  node customer-insight-generator.js org_123456789');
    console.log('  node customer-insight-generator.js org_123456789 /path/to/company-profile.txt');
    process.exit(1);
  }
  
  generateInsightReport(organizationId, contextFilePath)
    .then(() => {
      console.log('✅ Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}