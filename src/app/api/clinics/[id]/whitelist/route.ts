import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'

// GET /api/clinics/[id]/whitelist - List whitelisted parents
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    const whitelist = await prisma.parentWhitelist.findMany({
      where: { clinicId: params.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(whitelist)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching whitelist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/clinics/[id]/whitelist - Add email to whitelist
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    const body = await req.json()
    const { email, phone, name } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if clinic exists
    const clinic = await prisma.clinic.findUnique({
      where: { id: params.id }
    })

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    // Check if already whitelisted
    const existing = await prisma.parentWhitelist.findUnique({
      where: {
        clinicId_email: {
          clinicId: params.id,
          email: email.toLowerCase()
        }
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Email already whitelisted' }, { status: 409 })
    }

    const whitelistEntry = await prisma.parentWhitelist.create({
      data: {
        clinicId: params.id,
        email: email.toLowerCase(),
        phone,
        name,
      }
    })

    return NextResponse.json(whitelistEntry, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error adding to whitelist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/clinics/[id]/whitelist - Remove from whitelist (bulk or single)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    const email = req.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await prisma.parentWhitelist.delete({
      where: {
        clinicId_email: {
          clinicId: params.id,
          email: email.toLowerCase()
        }
      }
    })

    return NextResponse.json({ message: 'Removed from whitelist' })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error removing from whitelist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
