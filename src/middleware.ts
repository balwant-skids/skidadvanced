import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/care-plans(.*)',
  '/api/clinics/verify(.*)',
])

// Define admin routes
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/dashboard/admin(.*)',
])

// Define parent routes
const isParentRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/children(.*)',
  '/assessments(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Protect all other routes
  const { userId } = await auth()
  
  if (!userId) {
    await auth.protect()
    return
  }

  // Get user from database to check role
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, email: true }
    })

    if (!user) {
      // User not in database yet - might be first login
      // Redirect to onboarding or wait for webhook
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    const { role } = user
    const path = req.nextUrl.pathname

    // Role-based routing
    if (role === 'super_admin' || role === 'admin') {
      // Admins can access admin routes
      if (isParentRoute(req) && !isAdminRoute(req)) {
        // Redirect parents trying to access admin routes to admin dashboard
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
    } else if (role === 'parent' || role === 'demo') {
      // Parents can only access parent routes
      if (isAdminRoute(req)) {
        // Redirect admins trying to access parent routes to parent dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error in middleware:', error)
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
