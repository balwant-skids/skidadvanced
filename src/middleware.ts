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
  '/api/users/status(.*)',
  '/care-plans(.*)',
  '/care-plans-dynamic(.*)',
  '/plans(.*)',
  '/interventions(.*)',
  '/specialists(.*)',
  '/behavioral(.*)',
  '/discovery(.*)',
  '/demo(.*)',
  '/pending-approval(.*)',
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

  // Check if accessing dashboard - verify parent is active
  const pathname = req.nextUrl.pathname
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    try {
      // Fetch user status from API
      const baseUrl = req.nextUrl.origin
      const statusResponse = await fetch(`${baseUrl}/api/users/status`, {
        headers: {
          'x-clerk-user-id': userId,
        },
      })

      if (statusResponse.ok) {
        const { role, isActive } = await statusResponse.json()
        
        // If parent is not active, redirect to pending approval
        if (role === 'parent' && !isActive) {
          return NextResponse.redirect(new URL('/pending-approval', req.url))
        }
      }
    } catch (error) {
      console.error('Error checking user status:', error)
      // Continue on error to avoid blocking access
    }
  }

  // Note: Additional role-based routing is handled in individual page components
  // Each protected page should check user role via server component
  
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
