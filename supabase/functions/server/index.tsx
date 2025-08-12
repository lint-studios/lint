import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS and logging
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Helper function to verify user authentication
async function verifyAuth(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Authentication endpoints
app.post('/make-server-a4cd0473/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Create user with admin API to auto-confirm email
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || 'HelloLint User' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      message: 'Account created successfully!',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name
      }
    });

  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

app.get('/make-server-a4cd0473/auth/user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'HelloLint User',
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.log(`User verification error: ${error}`);
    return c.json({ error: 'Failed to verify user' }, 500);
  }
});

// Analytics data endpoint
app.get('/make-server-a4cd0473/analytics/overview', async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      const data = await kv.get('analytics:demo');
      return c.json(data || {
        totalFeedback: 24678,
        positiveSentiment: 78,
        opportunities: 147,
        hotTopics: 32,
        trends: {
          feedback: { value: 12, direction: 'up' },
          sentiment: { value: 5, direction: 'up' },
          opportunities: { value: 23, direction: 'up' },
          topics: { value: 8, direction: 'down' }
        }
      });
    }

    // Get user-specific analytics data
    const analyticsKey = `analytics:${user.id}`;
    const data = await kv.get(analyticsKey);
    
    if (!data) {
      // Initialize with default data for new users
      const defaultData = {
        totalFeedback: 0,
        positiveSentiment: 0,
        opportunities: 0,
        hotTopics: 0,
        trends: {
          feedback: { value: 0, direction: 'up' },
          sentiment: { value: 0, direction: 'up' },
          opportunities: { value: 0, direction: 'up' },
          topics: { value: 0, direction: 'up' }
        }
      };
      
      await kv.set(analyticsKey, defaultData);
      return c.json(defaultData);
    }
    
    return c.json(data);
    
  } catch (error) {
    console.log(`Error fetching analytics overview: ${error}`);
    return c.json({ error: 'Failed to fetch analytics data' }, 500);
  }
});

// Run analysis endpoint
app.post('/make-server-a4cd0473/analytics/analyze', async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const body = await c.req.json();
    const { timeRange = '30' } = body;

    // Simulate analysis process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update analytics data with new insights
    const analyticsKey = `analytics:${user.id}`;
    const currentData = await kv.get(analyticsKey) || {};
    
    const updatedData = {
      ...currentData,
      totalFeedback: (currentData.totalFeedback || 0) + Math.floor(Math.random() * 1000),
      positiveSentiment: Math.floor(Math.random() * 20) + 70,
      opportunities: (currentData.opportunities || 0) + Math.floor(Math.random() * 50),
      hotTopics: Math.floor(Math.random() * 20) + 20,
      lastAnalyzed: new Date().toISOString()
    };

    await kv.set(analyticsKey, updatedData);

    return c.json({ 
      success: true, 
      message: 'Analysis completed successfully',
      data: updatedData 
    });

  } catch (error) {
    console.log(`Error running analysis: ${error}`);
    return c.json({ error: 'Failed to run analysis' }, 500);
  }
});

// Insights endpoint
app.get('/make-server-a4cd0473/insights', async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    const insightsKey = user ? `insights:${user.id}` : 'insights:demo';
    
    const insights = await kv.get(insightsKey) || [
      {
        id: 'love-signals',
        title: 'Customer Love Signals',
        description: 'Top positive themes and quotes',
        type: 'positive',
        items: [
          {
            title: 'Fast Delivery Praise',
            description: '"Arrived next day, exactly as promised. Love the speed!"',
            metric: '847 mentions',
            status: 'positive'
          },
          {
            title: 'Product Quality',
            description: 'Customers consistently mention durability and craftsmanship',
            metric: '623 mentions',
            status: 'positive'
          }
        ]
      },
      {
        id: 'fix-first',
        title: 'Fix-First Issues',
        description: 'Recurring complaints and volume trends',
        type: 'negative',
        items: [
          {
            title: 'Sizing Accuracy',
            description: '"Runs small, had to exchange for larger size"',
            metric: '312 complaints',
            status: 'negative'
          },
          {
            title: 'Color Variations',
            description: 'Screen colors differ from actual product',
            metric: '186 complaints',
            status: 'negative'
          }
        ]
      }
    ];

    return c.json(insights);

  } catch (error) {
    console.log(`Error fetching insights: ${error}`);
    return c.json({ error: 'Failed to fetch insights' }, 500);
  }
});

// Reports endpoint
app.get('/make-server-a4cd0473/reports', async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    const reportsKey = user ? `reports:${user.id}` : 'reports:demo';
    
    const reports = await kv.get(reportsKey) || [
      {
        id: '1',
        name: 'November Customer Insights',
        date: 'November 15, 2024',
        sources: ['Judge.me Reviews', 'Support Tickets', 'Social Media'],
        highlights: [
          '78% positive sentiment, up 5% from last month',
          'Fast delivery mentioned in 847 reviews',
          'Sizing accuracy remains top complaint (312 mentions)'
        ],
        sentiment: 78
      }
    ];

    return c.json(reports);

  } catch (error) {
    console.log(`Error fetching reports: ${error}`);
    return c.json({ error: 'Failed to fetch reports' }, 500);
  }
});

// Generate report endpoint
app.post('/make-server-a4cd0473/reports/generate', async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const body = await c.req.json();
    const { timeRange = 'month', sources = [] } = body;

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newReport = {
      id: Date.now().toString(),
      name: `Customer Insights Report - ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleDateString(),
      sources: sources.length ? sources : ['Judge.me Reviews', 'Support Tickets'],
      highlights: [
        `${Math.floor(Math.random() * 20) + 70}% positive sentiment overall`,
        `${Math.floor(Math.random() * 500) + 200} positive mentions this period`,
        `Top complaint: ${['Sizing', 'Shipping', 'Color accuracy'][Math.floor(Math.random() * 3)]}`
      ],
      sentiment: Math.floor(Math.random() * 20) + 70
    };

    // Save to user's reports
    const reportsKey = `reports:${user.id}`;
    const currentReports = await kv.get(reportsKey) || [];
    const updatedReports = [newReport, ...currentReports];
    
    await kv.set(reportsKey, updatedReports);

    return c.json({ 
      success: true, 
      report: newReport,
      message: 'Report generated successfully' 
    });

  } catch (error) {
    console.log(`Error generating report: ${error}`);
    return c.json({ error: 'Failed to generate report' }, 500);
  }
});

// Integration test endpoint
app.post('/make-server-a4cd0473/integrations/test', async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const body = await c.req.json();
    const { platform, token } = body;

    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save integration status
    const integrationKey = `integration:${user.id}:${platform}`;
    await kv.set(integrationKey, {
      platform,
      token: token.substring(0, 4) + '••••••••••••',
      status: 'connected',
      lastTested: new Date().toISOString()
    });

    return c.json({ 
      success: true, 
      message: `${platform} integration test successful` 
    });

  } catch (error) {
    console.log(`Error testing integration: ${error}`);
    return c.json({ error: 'Integration test failed' }, 500);
  }
});

// Health check
app.get('/make-server-a4cd0473/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

serve(app.fetch);