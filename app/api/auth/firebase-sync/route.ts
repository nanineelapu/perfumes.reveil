/**
 * /api/auth/firebase-sync
 *
 * Originally a phone-existence pre-check. That endpoint was an account
 * enumeration oracle (different error for "registered" vs "not registered"),
 * so it has been neutralised: it now only validates the phone shape and
 * returns a generic success. The actual exists/not-exists branching happens
 * silently inside /api/auth/otp/verify after a real OTP succeeds.
 *
 * Kept at the same URL purely to avoid breaking the auth page while it is
 * refactored to call /api/auth/otp/send directly.
 */
import { NextResponse } from 'next/server'
import { normalizeIndianPhone } from '@/lib/validators'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: Request) {
    let body: any
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const digits = normalizeIndianPhone(body?.phone)
    if (!digits) {
        return NextResponse.json(
            { error: 'Please enter a valid 10-digit mobile number.' },
            { status: 400 }
        )
    }

    const ip = getClientIp(request)
    const rl = await rateLimit({ key: `precheck:ip:${ip}`, limit: 60, windowSec: 3600 })
    if (!rl.ok) return rateLimitResponse(rl)

    // Deliberately do NOT reveal whether this number is registered.
    return NextResponse.json({ success: true })
}
