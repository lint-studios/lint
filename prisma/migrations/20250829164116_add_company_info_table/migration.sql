-- Add vertical column to organizations table
ALTER TABLE "organizations" ADD COLUMN "vertical" TEXT;

-- Create comprehensive company_info table
CREATE TABLE "company_info" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    
    -- Business Fundamentals
    "business_model" TEXT, -- 'b2c', 'b2b', 'd2c', 'marketplace', 'subscription'
    "company_stage" TEXT, -- 'pre-launch', 'startup', 'growth', 'scale', 'enterprise'
    "founding_year" INTEGER,
    "employee_count" TEXT, -- '1-10', '11-50', '51-200', '201-500', '500+'
    "annual_revenue" TEXT, -- 'pre-revenue', '<100k', '100k-1m', '1m-10m', '10m-50m', '50m+'
    
    -- Product/Service Details
    "product_categories" JSONB, -- ['skincare', 'supplements', 'apparel', etc.]
    "price_range" JSONB, -- {min: 15, max: 150, average: 45, currency: 'USD'}
    "sku_count" INTEGER,
    "hero_products" JSONB, -- [{name, id, price, description}] top 5 products
    "product_lifecycle" TEXT, -- 'consumable', 'durable', 'seasonal', 'evergreen'
    "purchase_frequency" TEXT, -- 'one-time', 'monthly', 'quarterly', 'annual'
    
    -- Customer Demographics
    "target_audience" JSONB, -- {age: '25-45', gender: 'all', income: 'middle-high'}
    "customer_personas" JSONB, -- Array of persona objects
    "primary_markets" JSONB, -- ['US', 'CA', 'UK'] ISO country codes
    "customer_lifetime_value" DECIMAL(10,2),
    "average_order_value" DECIMAL(10,2),
    
    -- Competitive Landscape
    "direct_competitors" JSONB, -- [{name, website, strengths, weaknesses}]
    "indirect_competitors" JSONB,
    "market_position" TEXT, -- 'leader', 'challenger', 'follower', 'nicher'
    "unique_selling_props" JSONB, -- ['organic', 'made in usa', 'celebrity founded']
    "competitive_advantages" TEXT[],
    
    -- Marketing & Brand
    "brand_values" JSONB, -- ['sustainability', 'luxury', 'accessibility']
    "brand_voice" TEXT, -- 'professional', 'friendly', 'quirky', 'authoritative'
    "marketing_channels" JSONB, -- {primary: ['instagram', 'email'], secondary: [...]}
    "content_themes" JSONB, -- Topics they focus on
    "influencer_partnerships" BOOLEAN DEFAULT false,
    "affiliate_program" BOOLEAN DEFAULT false,
    
    -- Operations & Logistics
    "fulfillment_method" TEXT, -- 'self-fulfilled', '3pl', 'dropship', 'hybrid'
    "shipping_zones" JSONB, -- Countries/regions they ship to
    "average_shipping_time" TEXT, -- '1-2 days', '3-5 days', '1-2 weeks'
    "return_rate" DECIMAL(5,2), -- Percentage
    "return_policy_days" INTEGER,
    
    -- Sales Channels
    "sales_channels" JSONB, -- {online: ['website', 'amazon'], offline: ['retail']}
    "marketplace_presence" JSONB, -- ['amazon', 'etsy', 'walmart']
    "retail_presence" BOOLEAN DEFAULT false,
    "wholesale_enabled" BOOLEAN DEFAULT false,
    "subscription_offering" BOOLEAN DEFAULT false,
    
    -- Goals & Challenges
    "business_goals" JSONB, -- Current quarter/year objectives
    "key_challenges" JSONB, -- ['inventory', 'acquisition', 'retention']
    "growth_targets" JSONB, -- {revenue: '50%', customers: '30%'}
    "success_metrics" JSONB, -- KPIs they track
    
    -- Intelligence Preferences
    "report_focus_areas" JSONB, -- ['conversion', 'retention', 'competition']
    "alert_thresholds" JSONB, -- {negative_reviews: 0.2, competitor_mentions: 0.1}
    "excluded_topics" JSONB, -- Topics to ignore in analysis
    "custom_segments" JSONB, -- Customer segments they want tracked
    
    -- Metadata
    "data_quality_score" DECIMAL(3,2), -- 0-1 completeness score
    "last_enriched_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "company_info_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint
ALTER TABLE "company_info" ADD CONSTRAINT "company_info_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;

-- Add unique constraint to ensure one company_info per organization
ALTER TABLE "company_info" ADD CONSTRAINT "company_info_organization_id_key" UNIQUE ("organization_id");

-- Add indexes for common queries
CREATE INDEX "company_info_business_model_idx" ON "company_info"("business_model");
CREATE INDEX "company_info_company_stage_idx" ON "company_info"("company_stage");
CREATE INDEX "company_info_market_position_idx" ON "company_info"("market_position");
CREATE INDEX "company_info_data_quality_score_idx" ON "company_info"("data_quality_score");

-- Add table mapping
-- The @@map directive will be handled in the Prisma schema update