import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
        .select('name, description, category, images, price, slug')
        .eq('slug', slug)
        .single()

    if (!product) return { title: 'Product Not Found | REVEIL' }

    const title = `${product.name} — ${product.category || 'Luxury Fragrance'} | REVEIL`
    const description = product.description?.slice(0, 160) || `Experience the olfactory masterpiece ${product.name} from the REVEIL Laboratory Archive. Buy online at ₹${product.price}.`
    const image = product.images?.[0] || '/og-image.jpg'

    return {
        title,
        description,
        keywords: [
            product.name,
            `${product.name} price`,
            `buy ${product.name} online`,
            'luxury perfume india',
            product.category || 'perfume'
        ],
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://perfumesreveil.vercel.app/products/${product.slug}`,
            images: [{ url: image, width: 800, height: 800, alt: product.name }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
        alternates: {
            canonical: `https://perfumesreveil.vercel.app/products/${product.slug}`,
        },
    }
}

// ── SERVER PAGE ──────────────────────────────────────────────────────────────
export default async function ProductExperiencePage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // 1. Fetch Product
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !product) {
        notFound()
    }

    // 2. Fetch Reviews — exclude reviews authored by admins (test/seeded entries)
    const { data: allReviews } = await adminClient
        .from('reviews')
        .select(`
            id,
            rating,
            comment,
            created_at,
            reviewer_name,
            reviewer_avatar,
            heading,
            media_urls,
            user_id,
            profiles ( first_name, last_name, role )
        `)
        .eq('product_id', product.id)
        .order('created_at', { ascending: false })

    const reviews = (allReviews ?? []).filter((r: any) => {
        const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
        if (profile?.role === 'admin') return false
        // Heuristic fallback for seeded test data where the role flag may not
        // be set: hide reviews whose reviewer_name signals admin/test entries.
        const name = (r.reviewer_name || '').toLowerCase()
        if (name.includes('admin') || name.includes('test')) return false
        return true
    })

    // 3. Fetch related products — same category first, then top up with others
    const { data: sameCategory } = await supabase
        .from('products')
        .select('id, name, slug, price, images, category, rating, stock')
        .eq('category', product.category)
        .neq('id', product.id)
        .gt('stock', 0)
        .limit(8)

    let related = sameCategory ?? []
    if (related.length < 4) {
        const { data: filler } = await supabase
            .from('products')
            .select('id, name, slug, price, images, category, rating, stock')
            .neq('id', product.id)
            .gt('stock', 0)
            .limit(8 - related.length)
        related = [...related, ...(filler ?? [])]
    }

    // 3. Prepare JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images,
        sku: product.slug,
        brand: {
            '@type': 'Brand',
            name: 'REVEIL',
        },
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR',
            availability: product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            url: `https://perfumesreveil.vercel.app/products/${product.slug}`,
            seller: {
                '@type': 'Organization',
                name: 'REVEIL',
            },
        },
        ...(reviews && reviews.length > 0 && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating || 5,
                reviewCount: reviews.length,
                bestRating: 5,
                worstRating: 1,
            },
            review: reviews.slice(0, 5).map((r: any) => ({
                '@type': 'Review',
                reviewRating: {
                    '@type': 'Rating',
                    ratingValue: r.rating,
                    bestRating: 5,
                },
                author: {
                    '@type': 'Person',
                    name: r.profiles ? `${r.profiles.first_name} ${r.profiles.last_name}` : 'Verified Buyer',
                },
                reviewBody: r.comment,
            })),
        }),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductContent product={product} initialReviews={reviews || []} relatedProducts={related} />
        </>
    )
}
