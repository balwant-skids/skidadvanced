import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/clinics/verify?code=XXXXXX - Verify clinic code (public)
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Clinic code is required' })
    }

    const clinic = await prisma.clinic.findUnique({
      where: { code: code.toUpperCase() },
      select: {
        id: true,
        name: true,
        isActive: true,
      }
    })

    if (!clinic) {
      return NextResponse.json({ valid: false, message: 'Invalid clinic code' })
    }

    if (!clinic.isActive) {
      return NextResponse.json({ valid: false, message: 'This clinic is no longer active' })
    }

    return NextResponse.json({
      valid: true,
      clinic: {
        id: clinic.id,
        name: clinic.name,
      }
    })
  } catch (error) {
    console.error('Error verifying clinic code:', error)
    return NextResponse.json({ valid: false, message: 'Error verifying code' })
  }
}
