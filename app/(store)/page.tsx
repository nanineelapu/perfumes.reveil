import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import HeroCarousel from '@/components/store/HeroCarousel'
import ProductGrid from '@/components/store/ProductGrid'
import { ReveilCollectionSection, PhilosophySection, NotesSection } from '@/components/store/EditorialSections'
import { InfiniteIconCarousel } from '@/components/store/InfiniteIconCarousel'
import { NewsletterSection } from '@/components/store/NewsletterSection'
import { ReviewsSection } from '@/components/store/ReviewsSection'
import { FreeDeliveryRibbon } from '@/components/store/FreeDeliveryRibbon'

export const metadata: Metadata = {
  title: "REVEIL | The Official Online Store for Luxury Perfumes & Attars",
  description: "Shop the official REVEIL online store. Discover our signature long-lasting perfumes, traditional attars, and luxury diffusers. Experience the elite art of scent with Reveil Perfumes.",
}


export default async function HomePage() {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const [
    { data: slides },
    { data: allInStockProducts },
    { data: featured },
    { data: categories },
    { data: latestReviews },
  ] = await Promise.all([
    supabase
      .from('carousel_slides')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true }),

    supabase
      .from('products')
      .select('id, name, slug, price, images, category, rating, stock')
      .gt('stock', 0),

    supabase
      .from('products')
      .select('id, name, slug, price, images, category, rating, stock')
      .eq('is_featured', true)
      .gt('stock', 0)
      .limit(8),

    supabase
      .from('products')
      .select('category')
      .not('category', 'is', null),

    adminClient
      .from('reviews')
      .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer_name,
          reviewer_avatar,
          is_featured,
          profiles ( full_name, role )
      `)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(24),
  ])

  // Deduplicate categories with safety fallback
  const uniqueCategories = [...new Set((categories || []).map(p => p.category))] as string[]

  // Filter out admin-authored / seeded test reviews. We match on profile.role
  // first (proper signal), then fall back to a name heuristic so legacy test
  // data without the role flag still gets hidden.
  const latestReviewsFiltered = (latestReviews ?? []).filter((r: any) => {
    const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
    if (profile?.role === 'admin') return false
    const name = (r.reviewer_name || '').toLowerCase()
    if (name.includes('admin') || name.includes('test')) return false
    return true
  }).slice(0, 6)

  // Pick 4 products for Trending Curation, rotating daily.
  // Uses today's date (YYYY-MM-DD in IST) as a seed so the selection is
  // stable for the whole day and shuffles to a new set when the date rolls
  // over. If the admin has fewer than 4 products, we just show whatever is
  // available — no padding with placeholders.
  const seedFromDate = () => {
    const istNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
    const key = istNow.toISOString().slice(0, 10) // "2026-05-12"
    let h = 0
    for (let i = 0; i < key.length; i++) h = ((h << 5) - h + key.charCodeAt(i)) | 0
    return Math.abs(h) || 1
  }
  const mulberry32 = (a: number) => () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const rng = mulberry32(seedFromDate())
  const shuffled = [...(allInStockProducts ?? [])]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  // Prioritize Featured products from the Admin Panel. 
  // If no products are marked as featured, fall back to a random daily selection.
  const trending = (featured && featured.length > 0) 
    ? featured.slice(0, 4) 
    : shuffled.slice(0, 4);

  const homepageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'REVEIL',
    url: 'https://perfumesreveil.vercel.app',
    description: 'Premium perfumes and luxury fragrances from the REVEIL Studio Archive.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://perfumesreveil.vercel.app/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'REVEIL (Trimurty Enterprises)',
    url: 'https://perfumesreveil.vercel.app',
    logo: 'https://perfumesreveil.vercel.app/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-7008879914',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Marthapeta street, Near sano Bazar, near sidherswar kalyan mandap',
      addressLocality: 'Ganjam',
      addressRegion: 'Odisha',
      postalCode: '760009',
      addressCountry: 'IN'
    },
    sameAs: [
      'https://instagram.com/reveil_perfumes',
      'https://facebook.com/reveil.perfumes',
    ],
  }

  // Hero carousel is now driven entirely by admin-managed slides from the DB.
  const allSlides = slides ?? []

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <main style={{ background: '#f8f7f2', color: '#1a1a1a', overflowX: 'hidden' }}>
        {/* HIDDEN SEO HEADINGS - GOD LEVEL SEO */}
        <div className="sr-only">
          <h1>REVEIL - India's Premier Online Store for Luxury Perfumes and Designer Fragrances</h1>
          <h2>Buy Best Long Lasting Perfumes Online - Premium Oudh, Musk and Floral Scents</h2>
          <p>Welcome to REVEIL, your ultimate destination for high-end perfumery. Discover our signature collection of long-lasting perfumes, authentic attars, and premium air fresheners handcrafted for sophistication.</p>
          <h3>Designer Perfume Shop India - Signature Laboratory Archive</h3>
        </div>

        {/* Hero section */}
        <HeroCarousel slides={allSlides} />

        {/* Free Delivery Ribbon */}
        <FreeDeliveryRibbon />

        {/* 1. Trending Curation */}
        <ProductGrid items={trending ?? []} />

        {/* 2. Collections */}
        <NotesSection />

        {/* 3. Reviews */}
        <ReviewsSection reviews={latestReviewsFiltered} />

        {/* 4. Reveil Collection Big Image */}
        <ReveilCollectionSection />

        {/* Brand Theme / Value Carousel */}
        <InfiniteIconCarousel />

        {/* 5. Our Story */}
        <PhilosophySection />

        {/* 6. Join Reveil */}
        <NewsletterSection />

      </main>
    </>
  )
}