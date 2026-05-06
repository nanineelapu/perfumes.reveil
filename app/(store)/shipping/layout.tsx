import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Shipping & Delivery — REVEIL Logistics",
  description: "Information regarding REVEIL shipping policies, delivery timelines across India, and international fragrance logistics.",
}

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
