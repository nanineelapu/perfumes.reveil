import { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo/keywords'

export const metadata: Metadata = {
  title: 'Refund & Return Policy India — Reveil Fragrance',
  description:
    'Reveil Fragrance refund & return policy. 7-day return window on sealed perfumes. Easy refund process for damaged or incorrect orders shipped within India.',
  keywords: [
    'Reveil refund policy', 'perfume return policy India', 'how to return perfume online',
    'Reveil exchange policy',
  ],
  alternates: { canonical: `${SITE_URL}/refund` },
}

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
