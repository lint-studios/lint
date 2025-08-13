import { prisma } from '@/lib/prisma';

/**
 * Retrieves and decodes a stored API token for a given organization and service.
 * Temporary implementation: tokens are base64-encoded (mock encryption).
 * Replace with AES-256-GCM when proper encryption is reinstated.
 */
export async function getDecryptedToken(orgId: string, service: string): Promise<{ token: string; plainTextData: any }>{
  const tokenRecord = await prisma.apiToken.findUnique({
    where: {
      organizationId_service: {
        organizationId: orgId,
        service,
      },
    },
  });

  if (!tokenRecord || !tokenRecord.encryptedToken) {
    throw new Error(`API token not found for service: ${service}`);
  }

  const decryptedToken = Buffer.from(tokenRecord.encryptedToken, 'base64').toString('utf8');
  const plainTextData = tokenRecord.plainTextData ? JSON.parse(tokenRecord.plainTextData) : null;

  return { token: decryptedToken, plainTextData };
}



