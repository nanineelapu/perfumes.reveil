import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout — REVEIL',
  description: 'Securely complete your REVEIL order. Pay with Razorpay or Cash on Delivery.',
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}