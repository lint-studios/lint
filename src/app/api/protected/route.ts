import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Get the user's authentication status
  const { userId } = auth()

  // If not authenticated, return unauthorized
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // User is authenticated, proceed with protected logic
  return NextResponse.json({ 
    message: 'This is a protected API route',
    userId: userId 
  })
}

export async function POST(request: NextRequest) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  // Process the authenticated request
  return NextResponse.json({ 
    message: 'Data processed successfully',
    userId: userId,
    data: body 
  })
}
