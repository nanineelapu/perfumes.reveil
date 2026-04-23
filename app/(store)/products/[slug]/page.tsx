import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProductContent } from './ProductContent'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ slug: string }>
}

// ── DYNAMIC METADATA ────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('name, description, category, images')
        .eq('slug', slug)
        .single()

    if (!product) return { title: 'Product Not Found | REVEIL' }

    return {
        title: `${product.name} | ${product.category || 'Luxury Fragrance'} | REVEIL`,
        description: product.description || `Experience the olfactory masterpiece ${product.name} from the REVEIL Laboratory Archive.`,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.images?.[0] ? [{ url: product.images[0] }] : [],
        }
    }
}

// ── SERVER PAGE ──────────────────────────────────────────────────────────────
export default async function ProductExperiencePage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()

    // 1. Fetch Product
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !product) {
        notFound()
    }

    // 2. Fetch Reviews
    const { data: reviews } = await supabase
        .from('reviews')
        .select(`
            id,
            rating,
            comment,
            created_at,
            profiles ( full_name )
        `)
        .eq('product_id', product.id)
        .order('created_at', { ascending: false })

    return <ProductContent product={product} initialReviews={reviews || []} />
}
