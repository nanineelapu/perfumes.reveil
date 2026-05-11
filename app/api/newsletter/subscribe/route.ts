import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { isEmail } from '@/lib/validators'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/captcha'

const ADMIN_EMAIL = 'reveilfragrances@gmail.com'

const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]!))

export async function POST(req: Request) {
    try {
        let body: any
        try {
            body = await req.json()
        } catch {
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
        }
        const { email, captchaToken } = body || {}

        if (!isEmail(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
        }

        const ip = getClientIp(req)

        const captchaOk = await verifyTurnstile(typeof captchaToken === 'string' ? captchaToken : undefined, ip)
        if (!captchaOk) {
            return NextResponse.json({ error: 'Captcha verification failed' }, { status: 400 })
        }

        const ipRl = await rateLimit({ key: `newsletter:ip:${ip}`, limit: 10, windowSec: 3600 })
        if (!ipRl.ok) return rateLimitResponse(ipRl)

        // Use the cookie-bound client (anon key). Requires an RLS policy that
        // allows public INSERT into newsletter_subscribers — see security.sql.
        const supabase = await createClient()
        const { error: dbErr } = await supabase
            .from('newsletter_subscribers')
            .insert({ email: email.toLowerCase(), created_at: new Date().toISOString() })

        if (dbErr) {
            // 23505 = unique_violation — surface as success to avoid leaking
            // whether this address was already subscribed.
            if (dbErr.code !== '23505') {
                console.error('[Newsletter] DB insert failed')
                return NextResponse.json({ success: true })
            }
        }

        // Notify admin best-effort
        const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
        if (resend) {
            try {
                const safe = escapeHtml(email)
                await resend.emails.send({
                    from: 'REVEIL <newsletter@reveil-perfumes.com>',
                    to: ADMIN_EMAIL,
                    subject: `New newsletter signup — ${safe}`,
                    html: `<p>New subscriber: <strong>${safe}</strong></p>`,
                })
            } catch {
                // ignore — DB row is the source of truth
            }
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('[Newsletter] Error')
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }
}
