import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
    try {
        const { user_id, full_name, first_name, last_name } = await request.json()

        if (!user_id) {
            return NextResponse.json({ error: 'User ID is required.' }, { status: 400 })
        }

        if (!full_name) {
            return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
        }

        const supabaseAdmin = createAdminClient()

        const { error } = await supabaseAdmin
            .from('profiles')
            .update({
                full_name,
                first_name: first_name || undefined,
                last_name: last_name || undefined,
            })
            .eq('id', user_id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Save Profile Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
