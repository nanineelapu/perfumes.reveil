import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require'
import { clampString, isOdishaPincode, isUuid, normalizeIndianPhone } from '@/lib/validators'

export async function POST(request: Request) {
    try {
        const auth = await requireUser()
        if (!auth.ok) return auth.response
        const { user, supabase } = auth

        let body: any
        try {
            body = await request.json()
        } catch {
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
        }

        const {
            id, label, full_name, phone, address_line1, address_line2,
            city, state, pincode, is_default, updateOnly,
        } = body || {}

        if (id !== undefined && id !== null && !isUuid(id)) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        }

        // ── set-default-only shortcut ───────────────────────────────
        if (updateOnly && id) {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', user.id)
            const { error } = await supabase
                .from('addresses')
                .update({ is_default: true })
                .eq('id', id)
                .eq('user_id', user.id)
            if (error) return NextResponse.json({ error: 'Could not set default' }, { status: 500 })
            return NextResponse.json({ success: true })
        }

        // ── full upsert: validate everything ────────────────────────
        const safe = {
            label: clampString(label, 40),
            full_name: clampString(full_name, 80),
            address_line1: clampString(address_line1, 200),
            address_line2: address_line2 ? clampString(address_line2, 200) : null,
            city: clampString(city, 80),
            state: clampString(state, 80),
            pincode: typeof pincode === 'string' && /^[1-9][0-9]{5}$/.test(pincode) ? pincode : null,
        }
        if (!safe.label || !safe.full_name || !safe.address_line1 || !safe.city || !safe.state || !safe.pincode) {
            return NextResponse.json({ error: 'Missing or invalid address fields' }, { status: 400 })
        }
        if (!isOdishaPincode(safe.pincode)) {
            return NextResponse.json(
                { error: 'Reveil currently delivers only within Odisha. Please use an Odisha pincode (751xxx–770xxx).' },
                { status: 400 },
            )
        }
        const phoneDigits = normalizeIndianPhone(phone)
        if (!phoneDigits) {
            return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
        }

        if (is_default) {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', user.id)
        }

        const { data, error } = await supabase
            .from('addresses')
            .upsert({
                ...(id ? { id } : {}),
                user_id: user.id,
                label: safe.label,
                full_name: safe.full_name,
                phone: `+91${phoneDigits}`,
                address_line1: safe.address_line1,
                address_line2: safe.address_line2,
                city: safe.city,
                state: safe.state,
                pincode: safe.pincode,
                is_default: !!is_default,
            }, { onConflict: 'id' })
            .select()
            .single()

        if (error) return NextResponse.json({ error: 'Could not save address' }, { status: 500 })

        return NextResponse.json({ success: true, address: data })
    } catch (err: any) {
        console.error('Save Address Error')
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const auth = await requireUser()
    if (!auth.ok) return auth.response
    const { user, supabase } = auth

    let body: any
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    const { id } = body || {}
    if (!isUuid(id)) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return NextResponse.json({ error: 'Could not delete' }, { status: 500 })
    return NextResponse.json({ success: true })
}

export async function GET() {
    const auth = await requireUser()
    if (!auth.ok) return auth.response
    const { user, supabase } = auth

    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: 'Could not load addresses' }, { status: 500 })

    return NextResponse.json({ addresses: data })
}
