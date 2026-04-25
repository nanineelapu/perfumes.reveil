import { NextResponse } from 'next/server'
import { verifyMSG91OTP } from '@/lib/msg91'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
    try {
        const { phone, otp, isSignup, firstName, lastName, email } = await request.json()
        
        // 1. Verify OTP with MSG91
        const msg91Result = await verifyMSG91OTP(phone, otp)
        
        if (msg91Result.type !== 'success') {
            return NextResponse.json({ error: 'Invalid or expired OTP sequence.' }, { status: 400 })
        }

        // 2. Initialize Supabase with Service Role to manage users
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 3. Check if user exists, if not create them
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`
        
        // Find user by phone
        const { data: users, error: findError } = await supabaseAdmin.auth.admin.listUsers()
        let user = users?.users.find(u => u.phone === formattedPhone || u.email === email)

        if (!user && isSignup) {
            // Create new user if it's a signup
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                phone: formattedPhone,
                email: email,
                password: Math.random().toString(36).slice(-12), // Random password for phone-only users
                email_confirm: true,
                phone_confirm: true,
                user_metadata: { first_name: firstName, last_name: lastName }
            })
            if (createError) throw createError
            user = newUser.user
            
            // Sync to profiles table
            await supabaseAdmin.from('profiles').upsert({
                id: user?.id,
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: formattedPhone
            })
        }

        if (!user) {
            return NextResponse.json({ error: 'Account not found. Please register first.' }, { status: 404 })
        }

        // 4. Generate a Login Link (Magic Link) to sign the user in on the frontend
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: user.email!
        })

        if (linkError) throw linkError

        return NextResponse.json({ 
            success: true, 
            loginUrl: linkData.properties.action_link 
        })

    } catch (error: any) {
        console.error('Verification Logic Error:', error)
        return NextResponse.json({ error: error.message || 'Verification sequence failed.' }, { status: 500 })
    }
}
