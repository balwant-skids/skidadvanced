import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/sign-in',  // redirect here if not logged in
  },
})

export const config = {
  matcher: [
    '/discovery', '/discovery/(.*)',
    '/interventions', '/interventions/(.*)',
    '/specialists', '/specialists/(.*)',
    '/dashboard', '/dashboard/(.*)',
    '/admin', '/admin/(.*)'
  ],
}
