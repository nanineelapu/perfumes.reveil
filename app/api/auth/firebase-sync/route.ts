/**
 * /api/auth/firebase-sync
 *
 * Pre-check before sending OTP:
 *   - For LOGIN mode: verify the phone exists in our profiles table.
 *     If not found → return user_not_found so the frontend shows
 *     "Please register first" popup.
 *   - For SIGNUP mode: passes through (phone may or may not exist,
 *     the verify step handles upsert).
 */
import { NextResponse } from 'next/server'
import { normalizeIndianPhone } from '@/lib/validators'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/admin'

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

    const mode = body?.mode

    // For login mode: check if user exists in profiles table.
    // Signup mode passes through without checking.
    if (mode === 'login') {
        try {
            const admin = createAdminClient()
            const cleanPhone = `+91${digits}`
            const { data: profile } = await admin
                .from('profiles')
                .select('id')
                .or(`phone.eq.${cleanPhone},phone.eq.${digits}`)
                .maybeSingle()

            if (!profile) {
                return NextResponse.json(
                    { error: 'No account found for this number. Please create an account first.', error_code: 'user_not_found' },
                    { status: 404 }
                )
            }
        } catch (err) {
            // If DB check fails, allow through — verify step will handle it
            console.error('[firebase-sync] DB check failed:', err)
        }
    }

    return NextResponse.json({ success: true })
}
