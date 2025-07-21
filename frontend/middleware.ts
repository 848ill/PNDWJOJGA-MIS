import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get current path
  const pathname = request.nextUrl.pathname
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/landing', '/api', '/_next', '/favicon.ico']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Allow public routes
  if (isPublicRoute) {
    return response
  }

  // Check authentication for protected routes
  const { data: { user }, error } = await supabase.auth.getUser()

  // Special handling for root path - redirect to landing if not authenticated
  if (pathname === '/') {
    if (error || !user) {
      const landingUrl = new URL('/landing', request.url)
      return NextResponse.redirect(landingUrl)
    }
    // If authenticated, continue to dashboard (handled by route group)
  } else {
    // For other protected routes, redirect to login if not authenticated
    if (error || !user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Get user role for role-based access control
  const { data: userData } = await supabase
    .from('users')
    .select('*, roles(name)')
    .eq('id', user.id)
    .single()

  const userRole = userData?.roles?.name

  // Define role-based route protection
  const roleRoutes = {
    '/user-management': ['system_admin'],
    '/settings': ['system_admin'],
    '/it-support': ['system_admin', 'it_support'],
    '/complaints': ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official'],
    '/analytics': ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive'],
    '/ai-recommendations': ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive'],
  }

  // Check role-based access
  for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route)) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        const unauthorizedUrl = new URL('/unauthorized', request.url)
        return NextResponse.redirect(unauthorizedUrl)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 