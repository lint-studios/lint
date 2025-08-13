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
    
    // TEMPORARY: Just return success without database operation
    console.log('✅ Returning success without database operation');
    
    return NextResponse.json({ 
      success: true, 
      message: 'API working - database operation skipped for testing',
      organization: {
        id: params.id,
        name: name || 'Test Organization',
        siteUrl,
        industry,
        platform,
        timezone
      }
    });
  } catch (error) {
    console.error('💥 Organization update error:', error);
    
    if (error instanceof Error) {
      console.error('🐛 Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
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
