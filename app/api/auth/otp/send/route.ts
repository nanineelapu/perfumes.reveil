import { NextResponse } from 'next/server'
import { sendMessageCentralOTP } from '@/lib/messageCentral'
import { recordOtpSend } from '@/lib/auth/otp-store'
import { normalizeIndianPhone } from '@/lib/validators'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/captcha'

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

        // Captcha is optional in dev — required in prod (see lib/captcha.ts).
        const captchaToken: string | undefined = typeof body?.captchaToken === 'string' ? body.captchaToken : undefined
        const ip = getClientIp(request)
        const captchaOk = await verifyTurnstile(captchaToken, ip)
        if (!captchaOk) {
            return NextResponse.json({ error: 'Captcha verification failed. Please refresh and try again.' }, { status: 400 })
        }

        // Rate-limit: 1 OTP per 60s per phone, 5 per hour per phone, 30 per hour per IP.
        const perPhoneShort = await rateLimit({ key: `otp:send:phone:short:${phoneDigits}`, limit: 1, windowSec: 60 })
        if (!perPhoneShort.ok) return rateLimitResponse(perPhoneShort)
        const perPhoneHour = await rateLimit({ key: `otp:send:phone:hour:${phoneDigits}`, limit: 5, windowSec: 3600 })
        if (!perPhoneHour.ok) return rateLimitResponse(perPhoneHour)
        const perIpHour = await rateLimit({ key: `otp:send:ip:hour:${ip}`, limit: 30, windowSec: 3600 })
        if (!perIpHour.ok) return rateLimitResponse(perIpHour)

        const result = await sendMessageCentralOTP(phoneDigits)

        if (result.success && result.verificationId) {
            // Bind verificationId to this phone so /verify can refuse cross-phone use.
            try {
                await recordOtpSend(result.verificationId, phoneDigits)
            } catch (err) {
                console.error('[OTP Send] Failed to record binding')
                return NextResponse.json({ error: 'OTP service error. Please try again.' }, { status: 500 })
            }

            return NextResponse.json({
                success: true,
                verificationId: result.verificationId,
                message: 'OTP sent successfully',
            })
        }

        return NextResponse.json(
            { error: 'Failed to send OTP. Please try again.' },
            { status: 400 }
        )
    } catch (error: any) {
        console.error('[OTP Send Route] Error')
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
