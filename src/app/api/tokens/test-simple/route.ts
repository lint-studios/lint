import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    
    if (!userId || !orgId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { apiToken, storeUrl, per_page, page, verified } = body as any;

    if (!apiToken || !storeUrl) {
      return NextResponse.json(
        { error: 'API token and store URL are required' },
        { status: 400 }
      );
    }

    // Extract domain from storeUrl (remove https:// and trailing slashes)
    const domain = storeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Test the Judge.me API with the correct endpoint and headers
    const query = new URLSearchParams({
      api_token: apiToken,
      shop_domain: domain,
      per_page: String(per_page ?? 100),
      page: String(page ?? 1),
      verified: String(verified ?? true),
    });
    const testUrl = `https://judge.me/api/v1/reviews?${query.toString()}`;
    
    console.log('Testing Judge.me API with URL:', testUrl);
    console.log('Extracted domain:', domain);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Lint-Studio/1.0',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Judge.me API test successful:', data);
      
      return NextResponse.json({
        success: true,
        message: 'Judge.me connection test successful',
        reviewCount: data.reviews?.length || 0,
        totalReviews: data.total_reviews || 0,
        shopDomain: domain,
      });
    } else {
      const errorText = await response.text();
      console.error('Judge.me API test failed:', response.status, errorText);
      
      return NextResponse.json(
        { 
          success: false,
          error: `Judge.me API error: ${response.status} - ${errorText}` 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error testing Judge.me connection:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test Judge.me connection' 
      },
      { status: 500 }
    );
  }
}
