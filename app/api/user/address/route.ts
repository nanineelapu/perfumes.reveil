import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { 
            label, 
            full_name, 
            phone, 
            address_line1, 
            address_line2, 
            city, 
            state, 
            pincode,
            is_default 
        } = body

        // 1. If this is set as default, unset others first
        if (is_default) {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', user.id)
        }

        // 2. Insert the new address
        const { data, error } = await supabase
            .from('addresses')
            .insert({
                user_id: user.id,
                label,
                full_name,
                phone,
                address_line1,
                address_line2,
                city,
                state,
                pincode,
                is_default: is_default || false
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, address: data })

    } catch (err: any) {
        console.error('Save Address Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user.id)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ addresses: data })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
