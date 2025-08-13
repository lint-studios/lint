import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { encryptAesGcmHex } from '@/lib/enc';

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
    const { service, apiToken, plainTextData } = body;

    if (!service || !apiToken) {
      return NextResponse.json(
        { error: 'Service and API token are required' },
        { status: 400 }
      );
    }

    // Real AES-GCM encryption
    const encryptedData = encryptAesGcmHex(apiToken);

    // Store or update the token
    const tokenRecord = await prisma.apiToken.upsert({
      where: {
        api_tokens_organizationId_service_key: {
          organizationId: orgId,
          service,
        },
      },
      update: {
        encryptedToken: encryptedData.encryptedToken,
        iv: encryptedData.iv,
        tag: encryptedData.tag,
        plainTextData: plainTextData ? JSON.stringify(plainTextData) : null,
        updatedAt: new Date(),
      },
      create: {
        organizationId: orgId,
        service,
        encryptedToken: encryptedData.encryptedToken,
        iv: encryptedData.iv,
        tag: encryptedData.tag,
        plainTextData: plainTextData ? JSON.stringify(plainTextData) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${service} API token stored successfully`,
      id: tokenRecord.id,
    });

  } catch (error) {
    console.error('Error storing API token:', error);
    return NextResponse.json(
      { error: 'Failed to store API token' },
      { status: 500 }
    );
  }
}
