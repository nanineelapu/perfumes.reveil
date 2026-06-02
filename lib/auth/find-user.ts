import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Find an auth.users id by phone number.
 *
 * Supabase's admin API has no "get user by phone", and GoTrue stores the
 * phone in E.164-ish form (usually "917661891711", no leading "+"). We accept
 * a bare 10-digit Indian number and match it against the stored value after
 * stripping non-digits, tolerating both the 10-digit and 91-prefixed forms.
 *
 * listUsers() is paginated (1000/page); we walk up to 10 pages which is far
 * beyond the current user base. Returns the user id, or null if not found.
 */
export async function findAuthUserIdByPhone(
    admin: SupabaseClient,
    digits: string,
): Promise<string | null> {
    const targets = new Set([digits, `91${digits}`])
    const perPage = 1000

    for (let page = 1; page <= 10; page++) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
        if (error || !data?.users?.length) break

        for (const u of data.users) {
            const stored = (u.phone || '').replace(/\D/g, '')
            if (stored && targets.has(stored)) return u.id
        }

        if (data.users.length < perPage) break
    }

    return null
}
