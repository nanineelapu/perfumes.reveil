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
        // Extract token from Authorization header (as requested in Step 8)
        const authHeader = request.headers.get('Authorization')
        let idToken = ''
        
        const body = await request.json().catch(() => ({}))
        
        if (authHeader?.startsWith('Bearer ')) {
            idToken = authHeader.split('Bearer ')[1]
        } else {
            // Fallback to body if header is missing
            idToken = body.idToken
        }

        if (!idToken) {
            return NextResponse.json({ error: 'Missing authentication token.' }, { status: 401 })
        }

        const { isSignup, firstName, lastName, email: providedEmail } = body

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
        const { data: users } = await supabaseAdmin.auth.admin.listUsers()
        let user = users?.users.find(u => u.phone === phone || (providedEmail && u.email === providedEmail))

        if (!user && isSignup) {
            // Create new user if signing up
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                phone: phone,
                email: providedEmail || `${phone.replace('+', '')}@reveil.internal`, // Fallback email
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
                email: providedEmail,
                phone: phone
            })
        }

        if (!user) {
            return NextResponse.json({ error: 'Account not found. Please register first.' }, { status: 404 })
        }

        // 4. Generate Login Link (Magic Link) to sign the user into Supabase
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
        console.error('Firebase Auth Error:', error)
        return NextResponse.json({ error: error.message || 'Verification sequence failed.' }, { status: 500 })
    }
}
