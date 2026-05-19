import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Cart — Reveil Fragrance',
  description: 'Review your selected luxury perfumes and proceed to checkout at Reveil Fragrance.',
  robots: { index: false, follow: false }, // private — don't index
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
