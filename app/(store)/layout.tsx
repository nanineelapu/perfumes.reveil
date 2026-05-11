import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CartProvider } from '../api/cart/context/CartContext'
import type { Metadata } from 'next'

import { AnimatedNavbar } from "@/components/store/AnimatedNavbar"
import { Footer } from '@/components/store/Footer'
import { WhatsAppOverlay } from '@/components/store/WhatsAppOverlay'
import { AuthTokenCatcher } from '@/components/store/AuthTokenCatcher'

export const metadata: Metadata = {
// ... existing metadata ...
  metadataBase: new URL('https://perfumesreveil.vercel.app'),
  title: {
    default: 'REVEIL — Premium & Luxury Fragrances India',
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

// Every store page reads the user's auth cookie via Supabase, so prerendering
// is never appropriate here. Mark the segment dynamic so Next.js doesn't even
// attempt static generation (and stops logging DYNAMIC_SERVER_USAGE warnings).
export const dynamic = 'force-dynamic'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (e: any) {
    // DYNAMIC_SERVER_USAGE is Next.js' internal signal that a route bailed
    // out of static rendering — it's expected here, not a real error.
    if (e?.digest !== 'DYNAMIC_SERVER_USAGE') {
      console.error('Layout Auth Error:', e)
    }
  }

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <CartProvider>
        <AuthTokenCatcher />
        <AnimatedNavbar />
        {children}
        <Footer />
        <WhatsAppOverlay />
      </CartProvider>
    </div>
  )
}