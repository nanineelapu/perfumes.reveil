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
            id,
            label, 
            full_name, 
            phone, 
            address_line1, 
            address_line2, 
            city, 
            state, 
            pincode,
            is_default,
            updateOnly
        } = body

        // 1. If this is set as default, unset others first
        if (is_default) {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', user.id)
        }

        // 2. If updateOnly (for set default), just update that row
        if (updateOnly && id) {
            const { error } = await supabase
                .from('addresses')
                .update({ is_default: true })
                .eq('id', id)
                .eq('user_id', user.id)
            if (error) throw error
            return NextResponse.json({ success: true })
        }

        // 3. Upsert the address
        const { data, error } = await supabase
            .from('addresses')
            .upsert({
                ...(id ? { id } : {}),
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
            }, { onConflict: 'id' })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, address: data })

    } catch (err: any) {
        console.error('Save Address Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { id } = await request.json()
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (err: any) {
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
