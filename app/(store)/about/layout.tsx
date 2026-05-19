import { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo/keywords'

export const metadata: Metadata = {
  title: 'About Reveil Fragrance — Luxury Perfume Brand India',
  description:
    'Reveil Fragrance is an Indian luxury perfumery crafting long-lasting eau de parfum, authentic attars, and premium oudh. Based in Brahmapur, Odisha — shipping pan-India. Discover our story.',
  keywords: [
    'about Reveil Fragrance', 'Indian luxury perfume brand', 'perfume manufacturer India',
    'Brahmapur perfume brand', 'Odisha perfume brand', 'Trimurty Enterprises',
  ],
  alternates: { canonical: `${SITE_URL}/about` },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
