import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Get the Webhook secret
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log(`Webhook with an ID of ${body.data.id} and type of ${eventType}`);

  // Handle organization events
  switch (eventType) {
    case 'organization.created':
      try {
        const orgData = evt.data;
        console.log('Creating organization in database:', orgData);
        
        await prisma.organization.create({
          data: {
            id: orgData.id,
            name: orgData.name,
            slug: orgData.slug || null,
            logoUrl: orgData.image_url || null,
            createdAt: new Date(orgData.created_at),
            updatedAt: new Date(orgData.updated_at || orgData.created_at),
          }
        });
        
        console.log('Organization created successfully in database');
      } catch (error) {
        console.error('Error creating organization:', error);
        return new Response('Error creating organization', { status: 500 });
      }
      break;

    case 'organization.updated':
      try {
        const orgData = evt.data;
        console.log('Updating organization in database:', orgData);
        
        await prisma.organization.update({
          where: { id: orgData.id },
          data: {
            name: orgData.name,
            slug: orgData.slug || null,
            logoUrl: orgData.image_url || null,
            updatedAt: new Date(orgData.updated_at || Date.now()),
          }
        });
        
        console.log('Organization updated successfully in database');
      } catch (error) {
        console.error('Error updating organization:', error);
        return new Response('Error updating organization', { status: 500 });
      }
      break;

    case 'organization.deleted':
      try {
        const orgData = evt.data;
        console.log('Deleting organization from database:', orgData);
        
        await prisma.organization.delete({
          where: { id: orgData.id }
        });
        
        console.log('Organization deleted successfully from database');
      } catch (error) {
        console.error('Error deleting organization:', error);
        return new Response('Error deleting organization', { status: 500 });
      }
      break;

    default:
      console.log(`Unhandled webhook event type: ${eventType}`);
  }

  return new Response('', { status: 200 });
}
