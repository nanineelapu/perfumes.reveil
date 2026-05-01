import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: Request) {
    console.log('=== FIREBASE SYNC ===')

    try {
        const { phone, firebase_uid, mode } = await request.json()

        if (!phone) {
            return NextResponse.json({ error: 'Phone required' }, { status: 400 })
        }

        // Normalize phone to +91XXXXXXXXXX
        const digits = phone.replace(/\D/g, '')
        const cleanPhone = digits.length === 10 ? `+91${digits}` : `+${digits}`

        let userId: string | null = null
        let userEmail: string | null = null
        let needsName = false

        // 1. Find existing user
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
        const match = users?.find(u => (u.phone ?? '').replace(/\D/g, '') === cleanPhone.replace(/\D/g, ''))

        if (match) {
            userId = match.id
            userEmail = match.email ?? null
            const { data: profile } = await supabaseAdmin.from('profiles').select('first_name, full_name').eq('id', userId).maybeSingle()
            needsName = !profile?.first_name && !profile?.full_name
        }

        // 2. Create new user if not found
        if (!userId) {
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                phone: cleanPhone,
                email: `${cleanPhone.replace('+', '')}@reveil.internal`,
                phone_confirm: true,
                user_metadata: { firebase_uid },
            })
            if (createError) throw createError
            userId = newUser.user.id
            userEmail = newUser.user.email ?? null
            needsName = true
        }

        // 3. Ensure profile row exists
        await supabaseAdmin.from('profiles').upsert({ id: userId, phone: cleanPhone, role: 'user' }, { onConflict: 'id' })

        // 4. Generate Magic Link with FORCED production URL detection
        const protocol = request.headers.get('x-forwarded-proto') || 'https'
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'perfumesreveil.vercel.app'

        // If we detect localhost in the request, we use it, otherwise we use the live site
        const siteUrl = host.includes('localhost') ? `http://${host}` : `${protocol}://${host}`
        const redirectTo = `${siteUrl}/auth/callback`

        console.log('Redirecting to:', redirectTo)

        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: userEmail || `${cleanPhone.replace('+', '')}@reveil.internal`,
            options: { redirectTo }
        })

        if (linkError) throw linkError

        return NextResponse.json({
            success: true,
            loginUrl: linkData.properties.action_link,
            needs_name: needsName || mode === 'register',
            user_id: userId,
        })

    } catch (err: any) {
        console.error('Sync error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
