import type { SupabaseClient } from '@supabase/supabase-js'

export interface ProfileFields {
    id: string
    phone: string
    role?: string
    email?: string | null
    first_name?: string
    last_name?: string
    full_name?: string | null
}

/**
 * Upsert a profile row, tolerating a schema that may be missing optional
 * columns (e.g. `email`, added by supabase/security.sql — if that migration
 * has not been applied the column does not exist and the write throws).
 *
 * Strategy: try the full row first; if it fails, retry with only the core
 * identity columns (id, phone, role) so a signup is NEVER silently orphaned.
 * A partial upsert only touches the columns it provides, so the core-only
 * retry will not wipe an existing name.
 *
 * Returns null on success, or the underlying error message if even the
 * core write failed (the caller decides whether to surface it).
 */
export async function upsertProfile(
    admin: SupabaseClient,
    fields: ProfileFields,
): Promise<string | null> {
    const core = { id: fields.id, phone: fields.phone, role: fields.role ?? 'user' }

    const full: Record<string, unknown> = { ...core }
    if (fields.email !== undefined) full.email = fields.email
    if (fields.first_name !== undefined) full.first_name = fields.first_name
    if (fields.last_name !== undefined) full.last_name = fields.last_name
    if (fields.full_name !== undefined) full.full_name = fields.full_name

    const first = await admin.from('profiles').upsert(full, { onConflict: 'id' })
    if (!first.error) return null

    // Most likely an optional column is missing from the live schema. Surface it
    // loudly (so it gets fixed) but fall back to the core write so the account
    // still gets a usable profile and the user is not left orphaned.
    console.error('[upsertProfile] full upsert failed, retrying core-only:', first.error.message)

    const retry = await admin.from('profiles').upsert(core, { onConflict: 'id' })
    if (!retry.error) return null

    console.error('[upsertProfile] core upsert failed:', retry.error.message)
    return retry.error.message
}
