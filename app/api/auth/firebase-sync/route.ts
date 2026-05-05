/**
 * /api/auth/firebase-sync  →  /api/auth/pre-check
 *
 * This route is kept at the same URL path for backwards compatibility with the
 * auth page. It performs a phone number pre-validation check:
 *   - If mode === 'signup'  → returns error if number already exists
 *   - If mode === 'login'   → returns error if number does NOT exist
 *
 * Firebase has been fully removed. This now relies only on Supabase.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: Request) {
    try {
        const { phone, mode } = await request.json()

        if (!phone) {
            return NextResponse.json({ error: 'Phone required' }, { status: 400 })
        }

        // Normalize phone number
        let digits = phone.replace(/\D/g, '')
        if (digits.length === 12 && digits.startsWith('91')) {
            digits = digits.substring(2)
        }

        if (digits.length !== 10) {
            return NextResponse.json(
                { error: 'Please enter a valid 10-digit mobile number.' },
                { status: 400 }
            )
        }

        const cleanPhone = `+91${digits}`

        // Check if the user exists in Supabase Auth
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
        const match = users?.find(u => (u.phone ?? '').replace(/\D/g, '').endsWith(digits))

        // Fallback: check profiles table
        let profileMatch = null
        if (!match) {
            const { data } = await supabaseAdmin
                .from('profiles')
                .select('id, phone')
                .or(`phone.eq.${digits},phone.eq.${cleanPhone}`)
                .maybeSingle()
            profileMatch = data
        }

        const userExists = !!(match || profileMatch)

        if (mode === 'signup' && userExists) {
            return NextResponse.json(
                { error: 'This number is already registered. Please login instead.' },
                { status: 400 }
            )
        }

        if (mode === 'login' && !userExists) {
            return NextResponse.json(
                { error: 'This number is not registered. Please sign up first.' },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true })

    } catch (err: any) {
        console.error('[Pre-check] Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
