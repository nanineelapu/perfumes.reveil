import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Refund & Returns — The REVEIL Guarantee",
  description: "Learn about the REVEIL satisfaction guarantee. Our policy on returns and refunds for luxury perfumes and signature fragrances.",
}

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
