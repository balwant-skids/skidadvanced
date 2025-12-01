import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/care-plans(.*)',
  '/api/clinics/verify(.*)',
  '/care-plans(.*)',
  '/care-plans-dynamic(.*)',
  '/plans(.*)',
  '/interventions(.*)',
  '/specialists(.*)',
  '/behavioral(.*)',
  '/discovery(.*)',
  '/demo(.*)',
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

  // Note: Role-based routing is now handled in individual page components
  // to avoid Prisma usage in Edge Runtime middleware
  // Each protected page should check user role via API route or server component
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
