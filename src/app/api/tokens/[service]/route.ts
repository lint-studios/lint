import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
// Using basic existence check only in this route

export async function GET(
  request: NextRequest,
  { params }: { params: { service: string } }
) {
  try {
    const { userId, orgId } = await auth();
    
    if (!userId || !orgId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { service } = params;

    // Get the token record
    const tokenRecord = await prisma.apiToken.findUnique({
      where: {
        organizationId_service: {
          organizationId: orgId,
          service,
        },
      },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { error: 'API token not found' },
        { status: 404 }
      );
    }

    // For connection status checking, we don't need to decrypt the token
    // Just check if it exists and return basic info
    try {
      // Parse plain text data (this doesn't require decryption)
      const plainTextData = tokenRecord.plainTextData 
        ? JSON.parse(tokenRecord.plainTextData)
        : null;

      return NextResponse.json({
        service,
        plainTextData,
        // Don't return the decrypted token in the response for security
        // Instead, return a success indicator
        hasToken: true,
        createdAt: tokenRecord.createdAt,
        updatedAt: tokenRecord.updatedAt,
      });
    } catch (error) {
      console.error('Error parsing token data:', error);
      // Even if we can't parse the data, we know a token exists
      return NextResponse.json({
        service,
        hasToken: true,
        createdAt: tokenRecord.createdAt,
        updatedAt: tokenRecord.updatedAt,
      });
    }

  } catch (error) {
    console.error('Error retrieving API token:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve API token' },
      { status: 500 }
    );
  }
}

// Method to get decrypted token for internal use (not exposed via API)
// Note: moved token helpers to src/lib/tokens to avoid exporting functions from route modules
