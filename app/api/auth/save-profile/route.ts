import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require'
import { createAdminClient } from '@/lib/supabase/admin'
import { isPersonName, normalizeIndianPhone, isEmail } from '@/lib/validators'

export async function POST(request: Request) {
  const auth = await requireUser()
  if (!auth.ok) return auth.response

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { first_name, last_name, phone, email } = body || {}

  if (!isPersonName(first_name)) {
    return NextResponse.json({ error: 'Invalid first name' }, { status: 400 })
  }
  if (last_name !== undefined && last_name !== null && last_name !== '' && !isPersonName(last_name)) {
    return NextResponse.json({ error: 'Invalid last name' }, { status: 400 })
  }
  let cleanPhone: string | null = null
  if (phone !== undefined && phone !== null && phone !== '') {
    const digits = normalizeIndianPhone(phone)
    if (!digits) return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
    cleanPhone = `+91${digits}`
  }
  let cleanEmail: string | null = null
  if (email !== undefined && email !== null && email !== '') {
    if (!isEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    const normalized = (email as string).trim().toLowerCase()
    // Never let the internal placeholder back into profiles.email.
    if (/@reveil\.internal$/i.test(normalized)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    cleanEmail = normalized
  }

  const first = (first_name as string).trim()
  const last = (last_name ?? '').trim()
  const full_name = `${first} ${last}`.trim()

  // Always use the authenticated user's id from the session cookie. Never
  // trust a client-supplied user_id. role is hard-set to 'user' here.
  const admin = createAdminClient()
  const upsertRow: Record<string, unknown> = {
    id: auth.user.id,
    first_name: first,
    last_name: last,
    full_name,
    role: 'user',
  }
  if (cleanPhone) upsertRow.phone = cleanPhone
  if (cleanEmail) upsertRow.email = cleanEmail

  const { error } = await admin.from('profiles').upsert(upsertRow, { onConflict: 'id' })

  if (error) {
    console.error('Profile save error:', error.message)
    return NextResponse.json({ error: 'Could not save profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true, full_name })
}
