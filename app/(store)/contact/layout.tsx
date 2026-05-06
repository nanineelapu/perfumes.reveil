import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact Concierge — REVEIL Laboratory Support",
  description: "Get in touch with the REVEIL concierge team. For inquiries regarding signature perfumes, custom orders, or support, our experts are here to guide your olfactory journey.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
