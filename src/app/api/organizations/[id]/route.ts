import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, siteUrl, industry, platform, timezone, description } = await request.json();
    
    // Validate that the user has access to this organization
    // This would typically check if the user is a member of the organization
    // For now, we'll just update if the organization exists
    
    const organization = await prisma.organization.findUnique({
      where: { id: params.id }
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Update the organization
    const updatedOrganization = await prisma.organization.update({
      where: { id: params.id },
      data: {
        name: name || organization.name,
        siteUrl: siteUrl || null,
        industry: industry || null,
        platform: platform || null,
        timezone: timezone || null,
        updatedAt: new Date(),
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      organization: updatedOrganization 
    });
  } catch (error) {
    console.error('Organization update error:', error);
    
    // Check if it's a database connection error
    if (error instanceof Error) {
      if (error.message.includes('DATABASE_URL') || error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection failed', details: 'Please check DATABASE_URL environment variable' }, 
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: params.id }
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      organization 
    });
  } catch (error) {
    console.error('Organization fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
