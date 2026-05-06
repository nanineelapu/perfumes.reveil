import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Our Story — The REVEIL Laboratory Archive",
  description: "Discover the heritage of REVEIL. From traditional attars to modern olfactory masterpieces, learn about our commitment to luxury and craftsmanship in perfumery.",
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
