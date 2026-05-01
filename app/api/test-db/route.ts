import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
        .from('reviews')
        .select(`
            id,
            rating,
            comment,
            created_at,
            reviewer_name,
            reviewer_avatar,
            is_featured,
            product_id,
            products ( name ),
            profiles ( full_name )
        `)
    return NextResponse.json({ data, error })
}
