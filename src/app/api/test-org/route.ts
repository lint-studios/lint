import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Test endpoint to verify organization table connectivity
export async function GET() {
  try {
    // Test database connection
    const organizations = await prisma.organization.findMany();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      organizationCount: organizations.length,
      organizations: organizations
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Test endpoint to simulate webhook data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create test organization
    const org = await prisma.organization.create({
      data: {
        id: body.id || `test-org-${Date.now()}`,
        name: body.name || 'Test Organization',
        slug: body.slug || 'test-org',
        logoUrl: body.logoUrl || null,
        siteUrl: body.siteUrl || null,
        industry: body.industry || null,
        platform: body.platform || null,
        timezone: body.timezone || null,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Test organization created',
      organization: org
    });
  } catch (error) {
    console.error('Error creating test organization:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create test organization',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
