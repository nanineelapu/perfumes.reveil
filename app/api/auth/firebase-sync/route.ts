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
    const digits     = phone.replace(/\D/g, '')
    // Ensure it starts with +91 if it's 10 digits
    const cleanPhone = digits.length === 10 ? `+91${digits}` : `+${digits}`
    console.log('Phone:', cleanPhone, 'Mode:', mode)

    let userId: string | null = null
    let needsName = false

    // ── Find existing user ─────────────────────────────────────────────────
    const { data: { users } } =
      await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })

    const match = users?.find(u => {
      const d1 = (u.phone ?? '').replace(/\D/g, '')
      const d2 = cleanPhone.replace(/\D/g, '')
      return d1 === d2
    })

    if (match) {
      userId = match.id
      console.log('User found:', userId)

      // Check profile
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, first_name, full_name')
        .eq('id', userId)
        .maybeSingle()

      needsName = !profile?.first_name && !profile?.full_name
    }

    // ── Create new user if not found ──────────────────────────────────────
    if (!userId) {
      console.log('Creating new user:', cleanPhone)
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          phone:         cleanPhone,
          phone_confirm: true,
          user_metadata: { firebase_uid },
        })

      if (createError) {
        console.error('Create error:', createError)
        return NextResponse.json(
          { error: createError.message },
          { status: 500 }
        )
      }

      userId    = newUser.user.id
      needsName = true
      console.log('New user:', userId)
    }

    // ── Ensure profile row exists ─────────────────────────────────────────
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (!existingProfile) {
      await supabaseAdmin.from('profiles').insert({
        id:    userId,
        phone: cleanPhone,
        role:  'user',
      })
      needsName = true
    }

    // ── Create session — NO magic link, NO redirect ───────────────────────
    const { data: sessionData, error: sessionError } =
      await supabaseAdmin.auth.admin.createSession({
        user_id: userId!,
      })

    if (sessionError || !sessionData?.session) {
      console.error('Session error:', sessionError)
      return NextResponse.json(
        { error: 'Session failed: ' + sessionError?.message },
        { status: 500 }
      )
    }

    console.log('Session OK. needsName:', needsName)

    return NextResponse.json({
      success:       true,
      access_token:  sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
      needs_name:    needsName || mode === 'register',
      user_id:       userId,
    })

  } catch (err: any) {
    console.error('Sync error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
