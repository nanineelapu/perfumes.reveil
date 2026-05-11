import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export type AuthResult =
  | { ok: true; user: { id: string; email?: string | null }; supabase: Awaited<ReturnType<typeof createClient>> }
  | { ok: false; response: NextResponse }

export async function requireUser(): Promise<AuthResult> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { ok: true, user, supabase }
}

export async function requireAdmin(): Promise<AuthResult> {
  const base = await requireUser()
  if (!base.ok) return base
  const { data: profile } = await base.supabase
    .from('profiles')
    .select('role')
    .eq('id', base.user.id)
    .single()
  if (profile?.role !== 'admin') {
    return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return base
}
