import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: Request) {
  try {
    const { user_id, first_name, last_name, phone, email } = await request.json()
    console.log('Saving profile:', user_id, first_name, last_name, email)

    if (!user_id || !first_name) {
      return NextResponse.json(
        { error: 'user_id and first_name required' },
        { status: 400 }
      )
    }

    const full_name = `${first_name.trim()} ${(last_name ?? '').trim()}`.trim()

    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id:         user_id,
        first_name: first_name.trim(),
        last_name:  (last_name ?? '').trim(),
        full_name,
        phone,
        email:      (email ?? '').trim(),
        role:       'user',
      })

    if (error) {
      console.error('Profile save error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Profile saved:', full_name)
    return NextResponse.json({ success: true, full_name })
  } catch (err: any) {
    console.error('Save Profile Route Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
