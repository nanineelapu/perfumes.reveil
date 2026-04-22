import { createClient } from '@/lib/supabase/server'
import HeroCarousel from '@/components/store/HeroCarousel'
import ProductGrid from '@/components/store/ProductGrid'
import { PhilosophySection, NotesSection, BrandShowcaseSection, ReveilCollectionSection } from '@/components/store/EditorialSections'
import { NewsletterSection } from '@/components/store/NewsletterSection'
import { ReviewsSection } from '@/components/store/ReviewsSection'
import { FacilitySection } from '@/components/store/FacilitySection'


export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: slides },
    { data: trending },
    { data: featured },
    { data: categories },
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
  ])

  // Deduplicate categories with safety fallback
  const uniqueCategories = [...new Set((categories || []).map(p => p.category))] as string[]

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
      image_url: '', // Black background fallback
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
    <main style={{ background: '#050505', color: '#fff', overflowX: 'hidden' }}>
      {/* Hero section */}
      <HeroCarousel slides={allSlides} />

      {/* Editorial Content */}
      <PhilosophySection />

      <NotesSection />

      <BrandShowcaseSection />

      <ReveilCollectionSection />

      {/* Grid of Featured Products */}
      <ProductGrid items={trending ?? []} />

      {/* Facility / Studio Section */}
      <FacilitySection />

      {/* Testimonials */}
      <ReviewsSection />

      {/* Newsletter */}
      <NewsletterSection />

    </main>
  )
}