import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Role-based redirection
    const role = user.user_metadata?.role
    const path = request.nextUrl.pathname

    if (role === 'camionneur' && !path.startsWith('/dashboard/camionneur')) {
      return NextResponse.redirect(new URL('/dashboard/camionneur', request.url))
    }
    if (role === 'commercant' && !path.startsWith('/dashboard/commercant')) {
      return NextResponse.redirect(new URL('/dashboard/commercant', request.url))
    }
  }

  return response
}
