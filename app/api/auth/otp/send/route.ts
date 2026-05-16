import { NextResponse } from 'next/server'
import { sendMessageCentralOTP } from '@/lib/messageCentral'
import { recordOtpSend } from '@/lib/auth/otp-store'
import { normalizeIndianPhone } from '@/lib/validators'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: Request) {
    try {
        let body: any
        try {
            body = await request.json()
        } catch {
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
        }

        const phoneDigits = normalizeIndianPhone(body?.phone)
        if (!phoneDigits) {
            return NextResponse.json({ error: 'Please enter a valid 10-digit Indian mobile number.' }, { status: 400 })
        }

        const ip = getClientIp(request)

        // Abuse-protection rate-limits applied UPFRONT (broad windows so a
        // legitimate user who retries after a Message Central error isn't
        // locked out): 5 sends/hour/phone, 30 sends/hour/IP.
        const perPhoneHour = await rateLimit({ key: `otp:send:phone:hour:${phoneDigits}`, limit: 5, windowSec: 3600 })
        if (!perPhoneHour.ok) return rateLimitResponse(perPhoneHour)
        const perIpHour = await rateLimit({ key: `otp:send:ip:hour:${ip}`, limit: 30, windowSec: 3600 })
        if (!perIpHour.ok) return rateLimitResponse(perIpHour)

        const result = await sendMessageCentralOTP(phoneDigits)

        if (result.success && result.verificationId) {
            // Consume the 30-second cooldown slot ONLY after a successful
            // send. Doing this upfront would lock the user out for 30s every
            // time MC errored (missing env vars, JWT expiry, etc.) and leave
            // them staring at "Too many requests" with no recourse.
            await rateLimit({ key: `otp:send:phone:short:${phoneDigits}`, limit: 1, windowSec: 30 }).catch(() => {})

            // Bind verificationId to this phone (non-blocking — login still works if DB write fails).
            recordOtpSend(result.verificationId, phoneDigits).catch((err) => {
                console.error('[OTP Send] Failed to record binding (non-fatal):', err?.message)
            })

            return NextResponse.json({
                success: true,
                verificationId: result.verificationId,
                message: 'OTP sent successfully',
            })
        }

        // Surface the real Message Central failure reason so the operator
        // sees "OTP service not configured" instead of a vague "try again".
        const upstream = result.message || 'Unknown upstream error'
        console.error('[OTP Send] Message Central rejected send:', upstream)

        const lower = upstream.toLowerCase()
        const operatorHint =
            lower.includes('not configured')
                ? 'MESSAGE_CENTRAL_CUSTOMER_ID / MESSAGE_CENTRAL_AUTH_TOKEN are missing. Add them to .env.local and restart.'
                : lower.includes('jwt') || lower.includes('token') || lower.includes('unauthor') || lower.includes('401')
                ? 'Message Central auth token looks invalid or expired. Regenerate it in the MC dashboard and update .env.local.'
                : lower.includes('balance') || lower.includes('credit') || lower.includes('quota')
                ? 'Message Central account is out of SMS credits. Top up the account.'
                : null

        return NextResponse.json(
            {
                error: 'Failed to send OTP. Please try again.',
                reason: upstream,
                ...(operatorHint ? { hint: operatorHint } : {}),
            },
            { status: 400 }
        )
    } catch (error: any) {
        console.error('[OTP Send Route] Error:', error?.message || error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
