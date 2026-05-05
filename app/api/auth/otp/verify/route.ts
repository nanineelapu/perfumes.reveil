import { NextResponse } from 'next/server'
import { verifyMessageCentralOTP } from '@/lib/messageCentral'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
    try {
        const { phone, otp, verificationId, mode, firstName, lastName } = await request.json()

        if (!verificationId || !otp) {
            return NextResponse.json({ error: 'OTP and verification ID are required.' }, { status: 400 })
        }

        // 1. Verify OTP with Message Central
        const mcResult = await verifyMessageCentralOTP(verificationId, otp)

        if (!mcResult.success) {
            return NextResponse.json(
                { error: mcResult.message || 'Invalid or expired OTP.' },
                { status: 400 }
            )
        }

        // 2. Initialize Supabase Admin
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 3. Normalize phone
        const digits = phone.replace(/\D/g, '').replace(/^91/, '')
        const cleanPhone = `+91${digits}`

        // 4. Find or create user
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
        const existingUser = users?.find(u => (u.phone ?? '').replace(/\D/g, '').endsWith(digits))

        let userId: string
        let userEmail: string
        let needsName = false

        if (existingUser) {
            userId = existingUser.id
            userEmail = existingUser.email!
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('first_name, full_name')
                .eq('id', userId)
                .maybeSingle()
            needsName = !profile?.first_name && !profile?.full_name
        } else {
            // Create new user
            const internalEmail = `${digits}@reveil.internal`
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                phone: cleanPhone,
                email: internalEmail,
                phone_confirm: true,
                email_confirm: true,
                user_metadata: firstName ? { first_name: firstName, last_name: lastName ?? '' } : {},
            })
            if (createError) throw createError
            userId = newUser.user.id
            userEmail = newUser.user.email!

            await supabaseAdmin.from('profiles').upsert({
                id: userId,
                phone: cleanPhone,
                role: 'user',
                ...(firstName && { first_name: firstName, last_name: lastName ?? '' }),
            }, { onConflict: 'id' })

            needsName = !firstName
        }

        // 5. Generate Magic Link
        const protocol = request.headers.get('x-forwarded-proto') || 'https'
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'perfumesreveil.vercel.app'
        const siteUrl = host.includes('localhost') ? `http://${host}` : `${protocol}://${host}`
        const redirectTo = `${siteUrl}/auth/callback`

        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: userEmail,
            options: { redirectTo },
        })

        if (linkError) throw linkError

        return NextResponse.json({
            success: true,
            loginUrl: linkData.properties.action_link,
            needs_name: needsName,
            user_id: userId,
        })

    } catch (error: any) {
        console.error('[OTP Verify] Error:', error)
        return NextResponse.json({ error: error.message || 'Verification failed.' }, { status: 500 })
    }
}
