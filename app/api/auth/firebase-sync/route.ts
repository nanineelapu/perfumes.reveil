import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { admin } from '@/lib/firebase-admin'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { phone, firebase_uid, id_token, firstName, lastName, email } = body

        // 1. Determine which phone number to use
        let verifiedPhone = phone

        // 2. If an id_token is provided, verify it with Firebase Admin
        // This is our primary security check for production
        if (id_token) {
            try {
                const decodedToken = await admin.auth().verifyIdToken(id_token)
                verifiedPhone = decodedToken.phone_number || phone
            } catch (err) {
                console.error('[firebase-sync] Token verification failed:', err)
                return NextResponse.json({ error: 'Invalid authentication token.' }, { status: 401 })
            }
        } else if (process.env.NODE_ENV === 'production') {
            // In production, we MUST have a token
            return NextResponse.json({ error: 'Authentication token is required.' }, { status: 401 })
        }

        if (!verifiedPhone) {
            return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })
        }

        // Normalize to E.164 format e.g. +91XXXXXXXXXX
        const normalizedPhone = '+' + verifiedPhone.replace(/\D/g, '')
        const supabaseAdmin = createAdminClient()

        // 2. Find or Create Supabase User — track if we just created them
        let supabaseUser: any = null
        let is_new_user = false

        // Search 1: Find by phone in profiles table (fastest)
        const { data: profileRow } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('phone', normalizedPhone)
            .maybeSingle()

        if (profileRow) {
            const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profileRow.id)
            supabaseUser = user
        }

        // Search 2: Find by phone in auth.users (fallback for users created before profile sync)
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

        // 3. Ensure profile row exists (Robust Upsert)
        // Fallback: If no name is provided, try to use the part of the email before @
        const fallbackName = email ? email.split('@')[0] : 'Collector'
        const finalFirstName = firstName || (is_new_user ? fallbackName : undefined)

        const profileData = {
            id: supabaseUser.id,
            phone: normalizedPhone,
            email: email || supabaseUser.email,
            role: 'user',
            first_name: finalFirstName,
            last_name: lastName || undefined,
            full_name: firstName ? `${firstName} ${lastName || ''}`.trim() : (finalFirstName || 'Collector')
        }

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert(profileData, { onConflict: 'id' })

        if (profileError) {
            console.error('[firebase-sync] Profile creation failed:', profileError)
        }

        // 4. Determine the site origin robustly (works in both dev and production)
        const siteUrl =
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.NEXT_PUBLIC_SITE_URL ||
            request.headers.get('origin') ||
            new URL(request.url).origin

        // 5. Generate magic link.
        //    redirectTo = the URL Supabase sends the user to AFTER clicking the link.
        //    We point it to /auth/callback to handle the session establishment.
        const redirectTo = `${siteUrl}/auth/callback`

        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: supabaseUser.email!,
            options: { redirectTo }
        })

        if (linkError) throw linkError

        return NextResponse.json({
            success: true,
            loginUrl: linkData.properties.action_link,
            is_new_user,
            user_id: supabaseUser.id
        })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
