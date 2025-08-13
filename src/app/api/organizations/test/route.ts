import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function PATCH(request: NextRequest) {
  console.log('🔥 PATCH /api/organizations/test called');
  
  try {
    console.log('🔐 Getting auth from request...');
    const { userId } = getAuth(request);
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      console.log('❌ No user ID found, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('📝 Parsing request body...');
    const body = await request.json();
    console.log('📋 Form data:', body);
    
    console.log('✅ Returning success');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Organization test API working',
      data: body
    });
  } catch (error) {
    console.error('💥 Organization test error:', error);
    
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
