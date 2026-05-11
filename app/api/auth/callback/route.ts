import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { isSafeInternalPath } from '@/lib/validators'

/**
 * Supabase Auth Callback Handler
 *
 * This route receives the `code` parameter from Supabase magic links
 * (email OTP / magic link). It exchanges the code for a user session,
 * sets the session cookies, then redirects the user to their intended destination.
 *
 * Magic link flow:
 * 1. User clicks magic link in email (or is redirected via window.location.href)
 * 2. Supabase redirects to: <SITE_URL>/auth/callback?code=<code>
 * 3. This handler exchanges code → session
 * 4. Sets cookies and redirects to `next` param (defaults to /orders)
 */
export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const requestedNext = requestUrl.searchParams.get('next') ?? '/orders'
    // Reject absolute URLs, protocol-relative URLs, and anything that doesn't
    // look like a safe internal path — otherwise the magic link becomes an
    // open redirect to any attacker domain.
    const next = isSafeInternalPath(requestedNext) ? requestedNext : '/orders'

    // If no code is present, redirect to home
    if (!code) {
        return NextResponse.redirect(new URL('/', requestUrl.origin))
    }

    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // setAll called from Server Component — safe to ignore
                    }
                },
            },
        }
    )

    // Exchange the auth code for a session — this sets the session cookies
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
        console.error('[auth/callback] Code exchange failed:', error.message)
        // Redirect to auth page with an error hint
        return NextResponse.redirect(
            new URL(`/auth?error=session_failed`, requestUrl.origin)
        )
    }

    // Successful session — redirect to intended destination
    return NextResponse.redirect(new URL(next, requestUrl.origin))
}
