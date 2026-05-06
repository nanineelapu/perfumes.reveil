import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import HeroCarousel from '@/components/store/HeroCarousel'
import ProductGrid from '@/components/store/ProductGrid'
import { ReveilCollectionSection, PhilosophySection, NotesSection } from '@/components/store/EditorialSections'
import { InfiniteIconCarousel } from '@/components/store/InfiniteIconCarousel'
import { NewsletterSection } from '@/components/store/NewsletterSection'
import { ReviewsSection } from '@/components/store/ReviewsSection'

export const metadata: Metadata = {
  title: "REVEIL | The Official Online Store for Luxury Perfumes & Attars",
  description: "Shop the official REVEIL online store. Discover our signature long-lasting perfumes, traditional attars, and luxury diffusers. Experience the elite art of scent with Reveil Perfumes.",
}


export default async function HomePage() {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const [
    { data: slides },
    { data: trending },
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
      .from('homepage_curation')
      .select('*')
      .order('display_order', { ascending: true }),

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
          profiles ( full_name )
      `)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  // Deduplicate categories with safety fallback
  const uniqueCategories = [...new Set((categories || []).map(p => p.category))] as string[]

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

  const allSlides = [
    {
      id: 'intro-video',
      title: 'The Art of Scent',
      image_url: '/images/hero-1.png',
      video_url: 'https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/Ai%20Enhancer-Ultra%20Hd-Luxury%20Perfume%20Bottle%20Animationonline-Video-Cutter.Com2-Ezgif.Com-Reverse-Video.mp4',
      link: '/products',
      display_order: -1
    },
    {
      id: 'floral-collection',
      title: 'Explore Meena',
      image_url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=1600',
      link: '/products/floral',
      display_order: 3
    },
    {
      id: 'noir-collection',
      title: 'Our Wild Stones',
      image_url: 'https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2021%2C%202026%2C%2006_05_32%20PM.webp',
      link: '/products/noir',
      display_order: 4,
      button_label: 'GO TO COLLECTIONS'
    },
    ...slides ?? []
  ]

  // Premium Mock Data for Editorial Consistency
  const mockFeatured = [
    {
      id: 'perfume-1',
      name: 'Oudh Noir',
      slug: 'oudh-noir',
      price: 12500,
      images: ['https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=800'],
      category: 'EXTRAIT',
      rating: 5,
      stock: 10
    },
    {
      id: 'perfume-2',
      name: 'Saffron Silk',
      slug: 'saffron-silk',
      price: 8900,
      images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'],
      category: 'ESSENCE',
      rating: 5,
      stock: 5
    },
    {
      id: 'perfume-3',
      name: 'Velvet Rose',
      slug: 'velvet-rose',
      price: 15200,
      images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800'],
      category: 'LIMITED',
      rating: 5,
      stock: 2
    },
    {
      id: 'perfume-4',
      name: 'Midnight Musk',
      slug: 'midnight-musk',
      price: 11000,
      images: ['https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=800'],
      category: 'SERIES',
      rating: 5,
      stock: 8
    }
  ]

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
      <main style={{ background: '#050505', color: '#fff', overflowX: 'hidden' }}>
        {/* HIDDEN SEO HEADINGS - GOD LEVEL SEO */}
        <div className="sr-only">
          <h1>REVEIL - India's Premier Online Store for Luxury Perfumes and Designer Fragrances</h1>
          <h2>Buy Best Long Lasting Perfumes Online - Premium Oudh, Musk and Floral Scents</h2>
          <p>Welcome to REVEIL, your ultimate destination for high-end perfumery. Discover our signature collection of long-lasting perfumes, authentic attars, and premium air fresheners handcrafted for sophistication.</p>
          <h3>Designer Perfume Shop India - Signature Laboratory Archive</h3>
        </div>

        {/* Hero section */}
        <HeroCarousel slides={allSlides} />

        {/* 1. Trending Curation */}
        <ProductGrid items={trending ?? []} />

        {/* 2. Collections */}
        <NotesSection />

        {/* 3. Reviews */}
        <ReviewsSection reviews={latestReviews || []} />

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