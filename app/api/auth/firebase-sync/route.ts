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
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
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

        // 1. Verify Firebase ID Token for security
        const decodedToken = await admin.auth().verifyIdToken(id_token);
        const verifiedPhone = decodedToken.phone_number || phone;

        if (!verifiedPhone) {
            return NextResponse.json({ error: 'Verified phone number not found.' }, { status: 400 })
        }

        const basePhone = verifiedPhone.startsWith('+') ? verifiedPhone : `+91${verifiedPhone.replace(/[^\d]/g, '')}`
        const normalizedPhone = '+' + basePhone.replace(/\D/g, '')
        const supabaseAdmin = createAdminClient()

        // 2. Find or Create User in Supabase Auth
        let supabaseUser: any = null

        // Try to find by phone in profiles first
        const { data: profileRow } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('phone', normalizedPhone)
            .maybeSingle()

        if (profileRow) {
            const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profileRow.id)
            supabaseUser = user
        }

        // Fallback: search all users by phone with fuzzy match (ignores symbols like +)
        if (!supabaseUser) {
            const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
            supabaseUser = usersData?.users?.find(u => {
                if (!u.phone) return false
                const dbPhone = u.phone.replace(/\D/g, '')
                const inputPhone = normalizedPhone.replace(/\D/g, '')
                return dbPhone === inputPhone
            })
        }

        // Create if still not found
        if (!supabaseUser) {
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                phone: normalizedPhone,
                email: email || `${normalizedPhone.replace('+', '')}@reveil.internal`,
                password: Math.random().toString(36).slice(-12),
                phone_confirm: true,
                user_metadata: { first_name: firstName, last_name: lastName, firebase_uid }
            })
            if (createError) throw createError
            supabaseUser = newUser.user
        }

        // 3. Ensure Profile exists and is synchronized
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id, first_name, full_name')
            .eq('id', supabaseUser.id)
            .maybeSingle()

        if (!profile) {
            await supabaseAdmin.from('profiles').insert({
                id: supabaseUser.id,
                phone: normalizedPhone,
                full_name: firstName && lastName ? `${firstName} ${lastName}`.trim() : (firstName || lastName || '').trim(),
                first_name: firstName || supabaseUser.user_metadata?.first_name,
                last_name: lastName || supabaseUser.user_metadata?.last_name,
                email: email || supabaseUser.email,
                role: 'user'
            })
        } else if (firstName || lastName || email) {
            const fullName = firstName && lastName ? `${firstName} ${lastName}`.trim() : (firstName || lastName || undefined);
            await supabaseAdmin.from('profiles').update({
                full_name: fullName || undefined,
                first_name: firstName || undefined,
                last_name: lastName || undefined,
                email: email || undefined
            }).eq('id', supabaseUser.id)
        }

        // 4. Generate Magic Link using the user's actual Auth email
        const origin = request.headers.get('origin') || new URL(request.url).origin
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: supabaseUser.email!,
            options: { redirectTo: `${origin}/profile` }
        })

        if (linkError) throw linkError

        return NextResponse.json({
            success: true,
            loginUrl: linkData.properties.action_link,
            is_new_user: !profile || !profile.full_name,
            user_id: supabaseUser.id
        })

    } catch (err: any) {
        console.error('Firebase Sync Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
