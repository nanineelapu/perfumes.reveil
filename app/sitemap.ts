import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const baseUrl = 'https://perfumesreveil.vercel.app'

    // 1. Fetch all product slugs
    const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at')
        .order('updated_at', { ascending: false })

    const productEntries: MetadataRoute.Sitemap = (products || []).map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    // 2. Category pages
    const categories = ['PERFUMES', 'DEODRANTS', 'ATTARS', 'AIRFRESHNER']
    const categoryEntries: MetadataRoute.Sitemap = categories.map(cat => ({
        url: `${baseUrl}/products?category=${cat}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
    }))

    // 3. Main Static pages
    const staticEntries: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/wishlist`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        }
    ]

    return [...staticEntries, ...categoryEntries, ...productEntries]
}
