import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Terms of Service — REVEIL Legal",
  description: "Official terms and conditions for using the REVEIL online store. Legal information regarding your purchases and site usage.",
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
