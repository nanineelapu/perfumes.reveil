import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next 16 Proxy (replaces middleware.ts).
 *
 * 1. Refreshes Supabase session cookies (keeps users logged in).
 * 2. Sets baseline security headers on every response.
 *
 * CSP is set here so we can keep it tight even though the route handlers
 * don't render HTML. The CSP allows Razorpay checkout, Supabase, and our
 * known image hosts. Framer Motion requires 'unsafe-inline' for style-src.
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do NOT add any other awaits between createServerClient and getUser
  await supabase.auth.getUser()

  // ── Security headers ────────────────────────────────────────────────
  const headers = supabaseResponse.headers
  const isDev = process.env.NODE_ENV === 'development'

  // CSP — explicit allowlist, no eval, no inline scripts in prod.
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://checkout.razorpay.com https://*.razorpay.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    // Product images are user-configured (Supabase storage, Vercel blob, Unsplash, etc.) —
    // allow https: broadly for images. This is the standard trade-off for catalog sites.
    "img-src 'self' blob: data: https:",
    "media-src 'self' blob: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://lumberjack-cx.razorpay.com https://challenges.cloudflare.com",
    "frame-src https://api.razorpay.com https://*.razorpay.com https://checkout.razorpay.com https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ')

  headers.set('Content-Security-Policy', csp)
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), payment=(self "https://checkout.razorpay.com")')
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  headers.set('X-DNS-Prefetch-Control', 'off')

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match every path except:
     *  - _next/static, _next/image, favicon, common static asset extensions.
     * API routes ARE matched so they get the security headers too.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)',
  ],
}
