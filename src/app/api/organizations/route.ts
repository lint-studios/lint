import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    // Create organization using Clerk's API
    const response = await fetch('https://api.clerk.com/v1/organizations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        created_by: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Clerk API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create organization' }, 
        { status: response.status }
      );
    }

    const organization = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      organization 
    });
  } catch (error) {
    console.error('Organization creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organizations using Clerk's API
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/organization_memberships`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Clerk API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch organizations' }, 
        { status: response.status }
      );
    }

    const memberships = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      organizations: memberships 
    });
  } catch (error) {
    console.error('Organizations fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
