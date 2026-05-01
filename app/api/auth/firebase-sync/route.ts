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
        const { phone, firebase_uid, mode, checkOnly } = await request.json()

        if (!phone) {
            return NextResponse.json({ error: 'Phone required' }, { status: 400 })
        }

        // Normalize phone: remove all non-digits
        let digits = phone.replace(/\D/g, '')

        // If it starts with 91 and is 12 digits total, remove the 91
        if (digits.length === 12 && digits.startsWith('91')) {
            digits = digits.substring(2)
        }

        // 1. Strict Validation: Mobile number must be exactly 10 digits
        if (digits.length !== 10) {
            return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 })
        }

        const cleanPhone = `+91${digits}`

        let userId: string | null = null
        let userEmail: string | null = null
        let needsName = false

        // 2. Find existing user
        // A. Check Supabase Auth List
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
        const authMatch = users?.find(u => (u.phone ?? '').replace(/\D/g, '').endsWith(digits))
        
        let match = authMatch
        
        // B. If not in auth list, check profiles table
        if (!match) {
            const { data: profileMatch } = await supabaseAdmin
                .from('profiles')
                .select('id, phone')
                .or(`phone.eq.${digits},phone.eq.+91${digits}`)
                .maybeSingle()
            
            if (profileMatch) {
                // If we found them in profiles, fetch the actual auth user record
                const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profileMatch.id)
                if (user) match = user as any
            }
        }

        // 3. Mode Check: If signup but user exists -> Error
        if (mode === 'signup' && match) {
            return NextResponse.json({ 
                error: 'This number is already registered. Please login instead.' 
            }, { status: 400 })
        }

        // 4. Mode Check: If login but user DOES NOT exist -> Error
        if (mode === 'login' && !match) {
            return NextResponse.json({ 
                error: 'This number is not registered. Please sign up first.' 
            }, { status: 400 })
        }

        // If we are just checking user existence, we stop here
        if (checkOnly) {
            return NextResponse.json({ success: true })
        }

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
