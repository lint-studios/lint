import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  console.log('🔥 PATCH /api/organizations/test-no-auth called');
  
  try {
    console.log('📝 Parsing request body...');
    const body = await request.json();
    console.log('📋 Form data:', body);
    
    console.log('✅ Returning success without auth');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Organization test API working WITHOUT auth',
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
