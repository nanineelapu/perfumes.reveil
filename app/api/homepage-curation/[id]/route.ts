import { requireAdmin } from '@/lib/auth/require'
import { NextResponse } from 'next/server'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const auth = await requireAdmin()
    if (!auth.ok) return auth.response

    let body: Record<string, unknown>
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { data, error } = await auth.supabase
        .from('homepage_curation')
        .update(body)
        .eq('id', id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const auth = await requireAdmin()
    if (!auth.ok) return auth.response

    const { error } = await auth.supabase
        .from('homepage_curation')
        .delete()
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
