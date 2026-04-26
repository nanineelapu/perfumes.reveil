import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CartProvider } from '../api/cart/context/CartContext'
import type { Metadata } from 'next'

import { AnimatedNavbar } from "@/components/store/AnimatedNavbar"
import { Footer } from '@/components/store/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://perfumesreveil.vercel.app'),
  title: {
    default: 'REVEIL — Premium Perfumes & Luxury Fragrances India',
    template: '%s | REVEIL',
  },
  description: 'Discover the olfactory archive of REVEIL. Buy original perfumes, long-lasting fragrances, and luxury scents online at best prices. Free shipping across India.',
  keywords: [
    'REVEIL perfumes',
    'luxury fragrance india',
    'buy original perfume online',
    'long lasting perfumes for men',
    'best luxury perfumes for women',
    'authentic oud perfumes india',
    'premium attars online',
    'eau de parfum india'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'REVEIL',
    title: 'REVEIL — Premium Perfumes & Luxury Fragrances India',
    description: 'Original perfumes at best prices. Experience the Studio Archive of luxury scents.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'REVEIL — Luxury Perfumes',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REVEIL — Premium Perfumes & Luxury Fragrances',
    description: 'Original perfumes at best prices. Free shipping across India.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <CartProvider>
        <AnimatedNavbar />
        {children}
        <Footer />
      </CartProvider>
    </div>
  )
}