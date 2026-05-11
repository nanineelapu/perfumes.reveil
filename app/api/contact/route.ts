import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { clampString, isEmail, normalizeIndianPhone } from '@/lib/validators'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/captcha'

const ADMIN_RECIPIENT = 'reveilfragrances@gmail.com'

export async function POST(req: Request) {
    try {
        let body: any
        try {
            body = await req.json()
        } catch {
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
        }

        const name = clampString(body?.name, 80)
        const message = clampString(body?.message, 4000)
        if (!name || !message || !isEmail(body?.email)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }
        const email = (body.email as string).toLowerCase()

        let phone: string | null = null
        if (body?.phone) {
            const digits = normalizeIndianPhone(body.phone)
            if (!digits) return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
            phone = `+91${digits}`
        }

        const ip = getClientIp(req)
        const captchaOk = await verifyTurnstile(
            typeof body?.captchaToken === 'string' ? body.captchaToken : undefined,
            ip
        )
        if (!captchaOk) {
            return NextResponse.json({ error: 'Captcha verification failed' }, { status: 400 })
        }
        const rl = await rateLimit({ key: `contact:ip:${ip}`, limit: 5, windowSec: 3600 })
        if (!rl.ok) return rateLimitResponse(rl)

        const supabase = await createClient()
        const { error: dbError } = await supabase
            .from('contact_inquiries')
            .insert([{
                name,
                email,
                phone,
                message,
                admin_recipient: ADMIN_RECIPIENT,
                created_at: new Date().toISOString(),
            }])

        if (dbError) {
            console.error('Contact DB error')
            return NextResponse.json({ error: 'Could not submit inquiry' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact API Error')
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
