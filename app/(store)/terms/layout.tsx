import { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo/keywords'

export const metadata: Metadata = {
  title: 'Terms & Conditions — Reveil Fragrance India',
  description:
    'Read the terms and conditions for shopping at Reveil Fragrance, including order processing, payment, shipping, returns, and privacy.',
  keywords: ['Reveil terms and conditions', 'Reveil privacy policy', 'perfume site terms India'],
  alternates: { canonical: `${SITE_URL}/terms` },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
