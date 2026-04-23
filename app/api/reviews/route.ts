import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET — fetch reviews for a specific product
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get('product_id')

    if (!product_id) {
        return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('reviews')
        .select(`
            id,
            rating,
            comment,
            created_at,
            profiles ( full_name )
        `)
        .eq('product_id', product_id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reviews: data ?? [] })
}

// POST — submit a review
export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { product_id, rating, comment, order_id } = body

    if (!product_id || !rating) {
        return NextResponse.json({ error: 'product_id and rating are required' }, { status: 400 })
    }

    // 1. Check if user already reviewed this product
    const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product_id)
        .single()

    if (existing) {
        return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 })
    }

    // 2. Insert review
    const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .insert({
            user_id: user.id,
            product_id,
            order_id,
            rating,
            comment
        })
        .select()
        .single()

    if (reviewError) {
        return NextResponse.json({ error: reviewError.message }, { status: 500 })
    }

    // 3. Update Product Average Rating
    try {
        const { data: allRatings } = await supabase
            .from('reviews')
            .select('rating')
            .eq('product_id', product_id)

        if (allRatings && allRatings.length > 0) {
            const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
            
            await supabase
                .from('products')
                .update({ rating: parseFloat(avgRating.toFixed(1)) })
                .eq('id', product_id)
        }
    } catch (err) {
        console.error('Error updating product rating:', err)
    }

    return NextResponse.json({ review, action: 'submitted' }, { status: 201 })
}
