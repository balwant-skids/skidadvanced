import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Super admin emails
const SUPER_ADMIN_EMAILS = [
  'satish@skids.health',
  'drpratichi@skids.health'
];

// Demo/Marketing accounts
const DEMO_EMAILS = [
  'demo@skids.health',
  'marketing@skids.health'
];

export async function POST(req: Request) {
  // Get the webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    const phone = phone_numbers[0]?.phone_number;
    const name = `${first_name || ''} ${last_name || ''}`.trim() || email;

    if (!email) {
      return new Response('No email found', { status: 400 });
    }

    try {
      // Check if user is in whitelist
      const whitelistEntry = await prisma.parentWhitelist.findUnique({
        where: { email },
        include: { clinic: true }
      });

      if (!whitelistEntry) {
        // User not whitelisted - delete from Clerk
        console.log(`User ${email} not in whitelist - rejecting`);
        return new Response('User not whitelisted', { status: 403 });
      }

      // Determine role
      let role = 'parent';
      if (SUPER_ADMIN_EMAILS.includes(email)) {
        role = 'super_admin';
      } else if (DEMO_EMAILS.includes(email)) {
        role = 'demo';
      } else if (email.includes('admin@')) {
        role = 'admin';
      }

      // Create user in database
      const user = await prisma.user.create({
        data: {
          id: `user-${Date.now()}`,
          clerkId: id,
          email,
          name,
          phone,
          role,
        },
      });

      // Create parent profile if role is parent
      if (role === 'parent' || role === 'demo') {
        await prisma.parentProfile.create({
          data: {
            id: `parent-${Date.now()}`,
            userId: user.id,
            clinicId: whitelistEntry.clinicId,
          },
        });
      }

      // Mark as registered in whitelist
      await prisma.parentWhitelist.update({
        where: { email },
        data: { isRegistered: true },
      });

      console.log(`User created: ${email} with role: ${role}`);

      return new Response('User created successfully', { status: 200 });
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();

    if (!email) {
      return new Response('No email found', { status: 400 });
    }

    try {
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email,
          name: name || email,
          updatedAt: new Date(),
        },
      });

      return new Response('User updated successfully', { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      await prisma.user.delete({
        where: { clerkId: id },
      });

      return new Response('User deleted successfully', { status: 200 });
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
}
