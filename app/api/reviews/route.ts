import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET — fetch reviews
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get('product_id')
    const admin = searchParams.get('admin') === 'true'
    const featured = searchParams.get('featured') === 'true'

    const supabase = await createClient()
    const activeClient = createAdminClient()

    // If admin, check authorization
    if (admin) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        
        if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let query = activeClient
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
        .order('created_at', { ascending: false })

    if (product_id) query = query.eq('product_id', product_id)
    if (featured) query = query.eq('is_featured', true)
    if (!admin && !product_id && !featured) query = query.limit(10) // default limit for public feed

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reviews: data ?? [] })
}

// POST — submit/create a review
export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin is creating a manual review
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    
    const isAdmin = profile?.role === 'admin'

    const body = await request.json()
    const { product_id, rating, comment, order_id, reviewer_name, reviewer_avatar, is_featured } = body

    if (!rating) {
        return NextResponse.json({ error: 'rating is required' }, { status: 400 })
    }

    // 1. If not admin, check if user already reviewed this specific product
    if (!isAdmin && product_id) {
        const { data: existing } = await supabase
            .from('reviews')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', product_id)
            .single()

        if (existing) {
            return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 })
        }
    }

    // 2. Insert review
    const insertData: any = {
        rating,
        comment,
        is_featured: is_featured ?? false
    }

    if (isAdmin) {
        // Admin can set everything
        insertData.reviewer_name = reviewer_name
        insertData.reviewer_avatar = reviewer_avatar
        insertData.product_id = product_id || null
        insertData.user_id = body.user_id || user.id // Default to admin but allow impersonation or just leave user_id out
    } else {
        insertData.user_id = user.id
        insertData.product_id = product_id
        insertData.order_id = order_id
    }

    const activeClient = isAdmin ? createAdminClient() : supabase

    const { data: review, error: reviewError } = await activeClient
        .from('reviews')
        .insert(insertData)
        .select()
        .single()

    if (reviewError) {
        console.error('Supabase review insert error:', reviewError)
        return NextResponse.json({ error: reviewError.message, details: reviewError }, { status: 500 })
    }

    // 3. Update Product Average Rating if product_id exists
    if (product_id) {
        try {
            const { data: allRatings } = await supabase
                .from('reviews')
                .select('rating')
                .eq('product_id', product_id)

            if (allRatings && allRatings.length > 0) {
                const avgRating = allRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / allRatings.length
                
                await supabase
                    .from('products')
                    .update({ rating: parseFloat(avgRating.toFixed(1)) })
                    .eq('id', product_id)
            }
        } catch (err) {
            console.error('Error updating product rating:', err)
        }
    }

    return NextResponse.json({ review, action: 'submitted' }, { status: 201 })
}

// PATCH — update a review (Admin only)
export async function PATCH(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// DELETE — remove a review (Admin only)
export async function DELETE(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const adminClient = createAdminClient()
    const { error } = await adminClient
        .from('reviews')
        .delete()
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
