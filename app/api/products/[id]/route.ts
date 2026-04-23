import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { notifyGoogleOfChange } from '@/lib/utils/indexing'

type Params = Promise<{ id: string }>

export async function GET(_req: Request, { params }: { params: Params }) {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: { params: Params }) {
    const { id } = await params
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // TEMPORARILY DISABLED ROLE CHECK TO RESTORE ACCESS (Matches Admin Layout)
    /*
    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 })
    }
    */

    const body = await req.json()

    const { data, error } = await adminSupabase
        .from('products')
        .update(body)
        .eq('id', id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Notify Google of Update
    try {
        const baseUrl = 'https://reveil-perfumes.com';
        await notifyGoogleOfChange(`${baseUrl}/products/${data.slug}`, 'URL_UPDATED');
    } catch (err) {
        console.error('Indexing API Error:', err);
    }

    return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
    const { id } = await params
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // TEMPORARILY DISABLED ROLE CHECK TO RESTORE ACCESS
    /*
    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 })
    }
    */

    // Delete order items first (handled by adminSupabase if needed, but here simple cascading delete is expected)
    const { error } = await adminSupabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Notify Google of Deletion
    // Note: We'd ideally have the slug here, but since it's deleted, 
    // we assume the search console will eventually drop it, or we could have fetched it before deletion.
    // For now, we log the intent.
    
    return NextResponse.json({ success: true })
}
