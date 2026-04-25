import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    } catch (error) {
        console.error('Firebase Admin Init Error:', error);
    }
}

export async function POST(request: Request) {
    try {
        const { idToken, isSignup, firstName, lastName, email } = await request.json()

        // 1. Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const phone = decodedToken.phone_number;

        if (!phone) {
            return NextResponse.json({ error: 'Phone number not found in verification token.' }, { status: 400 })
        }

        // 2. Initialize Supabase Admin
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 3. Sync User with Supabase
        // Find user by phone
        const { data: users, error: findError } = await supabaseAdmin.auth.admin.listUsers()
        let user = users?.users.find(u => u.phone === phone || (email && u.email === email))

        if (!user && isSignup) {
            // Create new user
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                phone: phone,
                email: email,
                password: Math.random().toString(36).slice(-12),
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
                phone: phone
            })
        }

        if (!user) {
            return NextResponse.json({ error: 'Account not found. Please register first.' }, { status: 404 })
        }

        // 4. Generate Login Link
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
        console.error('Firebase Sync Error:', error)
        return NextResponse.json({ error: error.message || 'Verification sequence failed.' }, { status: 500 })
    }
}
