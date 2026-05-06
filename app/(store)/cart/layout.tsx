import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Your Bag — REVEIL Checkout",
  description: "Review your selected REVEIL fragrances. Proceed to checkout for the ultimate luxury perfume experience.",
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
