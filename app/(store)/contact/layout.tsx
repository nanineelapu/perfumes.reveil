import { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo/keywords'

export const metadata: Metadata = {
  title: 'Contact Reveil Fragrance — Customer Support India',
  description:
    'Contact Reveil Fragrance for product enquiries, order tracking, or customer support. We respond to perfume queries across India within 24 hours.',
  keywords: [
    'contact Reveil Fragrance', 'perfume customer support India', 'Reveil contact number',
    'perfume order help', 'Reveil customer care',
  ],
  alternates: { canonical: `${SITE_URL}/contact` },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
