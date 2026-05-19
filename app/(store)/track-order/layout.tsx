import { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo/keywords'

export const metadata: Metadata = {
  title: 'Track Your Order — Reveil Fragrance India',
  description:
    'Track your Reveil Fragrance perfume order in real-time. Enter your order ID or AWB number to get live shipping updates via Shiprocket.',
  keywords: [
    'track perfume order India', 'Reveil order tracking', 'Shiprocket tracking',
    'perfume delivery status India',
  ],
  alternates: { canonical: `${SITE_URL}/track-order` },
}

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
