import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔥 PATCH /api/organizations/[id] called with id:', params.id);
  
  try {
    console.log('🔐 Getting auth from request...');
    const { userId } = getAuth(request);
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      console.log('❌ No user ID found, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('📝 Parsing request body...');
    const { name, siteUrl, industry, platform, timezone, description } = await request.json();
    console.log('📋 Form data:', { name, siteUrl, industry, platform, timezone });
    
    console.log('🔍 Looking for organization in database...');
    const organization = await prisma.organization.findUnique({
      where: { id: params.id }
    });
    console.log('🏢 Found organization:', organization ? 'YES' : 'NO');

    if (!organization) {
      console.log('❌ Organization not found, returning 404');
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    console.log('💾 Updating organization...');
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
    console.log('✅ Organization updated successfully');
    
    return NextResponse.json({ 
      success: true, 
      organization: updatedOrganization 
    });
  } catch (error) {
    console.error('💥 Organization update error:', error);
    
    if (error instanceof Error) {
      console.error('🐛 Error details:', {
        message: error.message,
        name: error.name
      });
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
  console.log('🔥 GET /api/organizations/[id] called with id:', params.id);
  
  try {
    const { userId } = getAuth(request);
    console.log('👤 User ID:', userId);
    
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
    console.error('💥 Organization fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
