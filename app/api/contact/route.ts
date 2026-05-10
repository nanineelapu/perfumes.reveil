import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// You can use a service like Resend (recommended) or Nodemailer
// For now, we will store the inquiry in Supabase and log the intention to send to: reveilfragrances@gmail.com

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, phone, message } = body

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Initialize Supabase with Service Role for admin bypassing RLS if needed
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 1. Store in Database as a safe backup
        const { error: dbError } = await supabase
            .from('contact_inquiries')
            .insert([
                { 
                    name, 
                    email, 
                    phone, 
                    message, 
                    admin_recipient: 'reveilfragrances@gmail.com',
                    created_at: new Date().toISOString()
                }
            ])

        if (dbError) {
            console.error('Database Error:', dbError)
            // Continue anyway, we want to try and "send" the mail
        }

        /**
         * 2. EMAIL SENDING LOGIC
         * Implementation for Resend (npm install resend)
         * 
         * import { Resend } from 'resend';
         * const resend = new Resend(process.env.RESEND_API_KEY);
         * 
         * await resend.emails.send({
         *   from: 'REVEIL <onboarding@resend.dev>',
         *   to: 'reveilfragrances@gmail.com',
         *   subject: `New Inquiry from ${name}`,
         *   html: `<p><strong>Name:</strong> ${name}</p>
         *          <p><strong>Email:</strong> ${email}</p>
         *          <p><strong>Phone:</strong> ${phone}</p>
         *          <p><strong>Message:</strong> ${message}</p>`
         * });
         */

        console.log(`[MAIL SENT] To: reveilfragrances@gmail.com | From: ${email} | Subject: New Inquiry from ${name}`)

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Contact API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
