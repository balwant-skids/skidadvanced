import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  // Get the webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET')
    return new Response('Webhook secret not configured', { status: 500 })
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verify the webhook
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Webhook verification failed', { status: 400 })
  }

  // Handle the event
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data

    const email = email_addresses?.[0]?.email_address
    const phone = phone_numbers?.[0]?.phone_number
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'User'

    if (!email) {
      return new Response('No email found', { status: 400 })
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: id },
      })

      if (!existingUser) {
        // Create new user
        await prisma.user.create({
          data: {
            clerkId: id,
            email,
            name,
            phone,
            role: 'parent', // Default role
          },
        })
        console.log(`Created user: ${email}`)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      return new Response('Error creating user', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data

    const email = email_addresses?.[0]?.email_address
    const phone = phone_numbers?.[0]?.phone_number
    const name = [first_name, last_name].filter(Boolean).join(' ')

    try {
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          ...(email && { email }),
          ...(name && { name }),
          ...(phone && { phone }),
        },
      })
      console.log(`Updated user: ${id}`)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      await prisma.user.delete({
        where: { clerkId: id },
      })
      console.log(`Deleted user: ${id}`)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return new Response('Webhook processed', { status: 200 })
}
