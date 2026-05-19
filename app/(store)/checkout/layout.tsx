import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Secure Checkout — Reveil Fragrance',
  description:
    'Complete your order securely at Reveil Fragrance. Pay online via Razorpay (UPI, cards, net-banking) or choose cash on delivery.',
  robots: { index: false, follow: false }, // checkout flow — keep private
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
