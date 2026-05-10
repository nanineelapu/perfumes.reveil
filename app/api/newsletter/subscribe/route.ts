import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const ADMIN_EMAIL = 'reveilfragrances@gmail.com'

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Basic email shape check
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
        }

        // 1. Persist to Supabase so we never lose a signup, even if email send fails
        try {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            )
            await supabase
                .from('newsletter_subscribers')
                .insert({ email, created_at: new Date().toISOString() })
        } catch (dbErr) {
            console.error('[Newsletter] DB insert failed (continuing):', dbErr)
        }

        // 2. Notify the admin via Resend
        const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'REVEIL <newsletter@reveil-perfumes.com>',
                    to: ADMIN_EMAIL,
                    replyTo: email,
                    subject: `New newsletter signup — ${email}`,
                    html: `
                        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #050505; color: #fff;">
                            <p style="font-size: 11px; color: #d4af37; letter-spacing: 0.4em; text-transform: uppercase; margin: 0 0 24px;">REVEIL — New Subscriber</p>
                            <h2 style="font-size: 22px; margin: 0 0 16px; color: #fff;">A new visitor joined the list</h2>
                            <p style="color: #aaa; font-size: 14px; line-height: 1.6;">Add them to your campaign list, or reply directly to this email.</p>
                            <div style="margin-top: 24px; padding: 16px 20px; background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.25); border-radius: 6px;">
                                <p style="margin: 0; font-size: 12px; color: #d4af37; letter-spacing: 0.2em; text-transform: uppercase;">Email</p>
                                <p style="margin: 6px 0 0; font-size: 16px; color: #fff;">${email}</p>
                            </div>
                            <p style="margin-top: 32px; font-size: 10px; color: #555; letter-spacing: 0.3em; text-transform: uppercase;">Sent automatically by reveil-perfumes.com</p>
                        </div>
                    `,
                })
            } catch (mailErr) {
                console.error('[Newsletter] Email send failed (continuing):', mailErr)
            }
        } else {
            console.log(`[Newsletter MOCK] New signup: ${email} → ${ADMIN_EMAIL}`)
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('[Newsletter] Error:', err)
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }
}
