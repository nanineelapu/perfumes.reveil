import type { Metadata } from 'next'
import { ProductListContent } from './ProductListContent'
import { Suspense } from 'react'
import { Sparkles } from 'lucide-react'
import { PremiumLoader } from '@/components/store/PremiumLoader'

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  PERFUMES: {
    title: 'Luxury Perfumes Online — Signature Fragrances | REVEIL',
    description: 'Shop our curated collection of luxury perfumes. Long-lasting, high-concentration scents from the REVEIL Studio Archive.',
  },
  DEODRANTS: {
    title: 'Premium Deodorants & Body Sprays | REVEIL',
    description: 'Experience all-day freshness with our premium deodorants. Luxury body sprays inspired by our signature fragrance lines.',
  },
  ATTARS: {
    title: 'Authentic Attars & Perfume Oils Online India | REVEIL',
    description: 'Traditional attars and concentrated perfume oils. Pure, alcohol-free fragrances crafted with the finest ingredients.',
  },
  AIRFRESHNER: {
    title: 'Luxury Home Fragrances & Air Freshners | REVEIL',
    description: 'Transform your space with REVEIL luxury air freshners. Signature scents designed for the sophisticated home.',
  },
  OUDH: {
    title: 'Premium Oudh Perfumes & Agarwood Fragrances | REVEIL',
    description: 'Explore the deep, mystical world of REVEIL Oudh. Intense, long-lasting agarwood perfumes for true connoisseurs.',
  },
  MUSK: {
    title: 'Signature Musk Perfumes & Clean Scents | REVEIL',
    description: 'Elegant musk fragrances from REVEIL. Sophisticated, intimate scents designed for all-day wear.',
  },
  FLORAL: {
    title: 'Luxury Floral Perfumes — Fresh Bloom Collection | REVEIL',
    description: 'Experience the freshness of REVEIL Floral. Hand-picked botanical scents and blooming fragrance masterpieces.',
  },
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}): Promise<Metadata> {
  const { category } = await searchParams
  const catKey = category?.toUpperCase()
  const meta = catKey ? CATEGORY_META[catKey] : null

  const title = meta?.title ?? 'All Fragrances — Explore the Studio Archive | REVEIL'
  const description = meta?.description ?? 'Shop original REVEIL perfumes, attars, and luxury fragrances. Free shipping above ₹499, cash on delivery available across India.'

  return {
    title,
    description,
    openGraph: {
        title,
        description,
        url: category ? `https://perfumesreveil.vercel.app/products?category=${category}` : 'https://perfumesreveil.vercel.app/products',
    },
    alternates: {
      canonical: category
        ? `https://perfumesreveil.vercel.app/products?category=${category}`
        : 'https://perfumesreveil.vercel.app/products',
    },
  }
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <PremiumLoader iconName="sparkles" text="Loading Fragrances" />
        }>
            {/* HIDDEN SEO HEADINGS - GOD LEVEL SEO */}
            <div className="sr-only">
                <h1>Shop Luxury Fragrances Online - REVEIL Laboratory Archive</h1>
                <h2>Best Long Lasting Perfumes, Premium Oudh, and Authentic Attars in India</h2>
                <p>Browse our curated collection of designer perfumes and signature scents. High-concentration fragrances designed for maximum longevity and olfactory impact.</p>
            </div>
            <ProductListContent />
        </Suspense>
    )
}
