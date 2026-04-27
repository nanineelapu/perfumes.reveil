import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (projectId && clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
            });
        } else {
            admin.initializeApp({ projectId });
        }
    } catch (error) {
        console.error('Firebase Admin Init Error:', error);
    }
}

export async function POST(request: Request) {
    try {
        const { phone, firebase_uid, id_token, firstName, lastName, email } = await request.json()

        if (!id_token) {
            return NextResponse.json({ error: 'Authentication token is required.' }, { status: 401 })
        }

        // 1. Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(id_token);
        const verifiedPhone = decodedToken.phone_number || phone;

        if (!verifiedPhone) {
            return NextResponse.json({ error: 'Phone number not found.' }, { status: 400 })
        }

        const normalizedPhone = '+' + verifiedPhone.replace(/\D/g, '')
        const supabaseAdmin = createAdminClient()

        // 2. Find or Create Supabase User — track if we just created them
        let supabaseUser: any = null
        let is_new_user = false

        // Search 1: Find by phone in profiles table
        const { data: profileRow } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('phone', normalizedPhone)
            .maybeSingle()

        if (profileRow) {
            const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profileRow.id)
            supabaseUser = user
        }

        // Search 2: Find by phone in auth users (fuzzy match)
        if (!supabaseUser) {
            const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
            supabaseUser = usersData?.users?.find(u => {
                if (!u.phone) return false
                return u.phone.replace(/\D/g, '') === normalizedPhone.replace(/\D/g, '')
            })
        }

        // Search 3: Not found — create brand new user
        if (!supabaseUser) {
            is_new_user = true
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                phone: normalizedPhone,
                email: email || `${normalizedPhone.replace('+', '')}@reveil.internal`,
                password: Math.random().toString(36).slice(-12),
                phone_confirm: true,
                user_metadata: { firebase_uid }
            })
            if (createError) throw createError
            supabaseUser = newUser.user
        }

        // 3. Ensure profile row exists
        const { data: existingProfile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', supabaseUser.id)
            .maybeSingle()

        if (!existingProfile) {
            // Create placeholder profile — name will be filled in next step for new users
            await supabaseAdmin.from('profiles').insert({
                id: supabaseUser.id,
                phone: normalizedPhone,
                role: 'user'
            })
        }

        // 4. Generate magic link — redirect to home page after login
        const origin = request.headers.get('origin') || new URL(request.url).origin
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: supabaseUser.email!,
            options: { redirectTo: `${origin}/` }
        })

        if (linkError) throw linkError

        return NextResponse.json({
            success: true,
            loginUrl: linkData.properties.action_link,
            is_new_user,
            user_id: supabaseUser.id
        })

    } catch (err: any) {
        console.error('Firebase Sync Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
