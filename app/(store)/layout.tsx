import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CartProvider } from '../api/cart/context/CartContext'

import { AnimatedNavbar } from "@/components/store/AnimatedNavbar"
import { Footer } from '@/components/store/Footer'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <CartProvider>
        <AnimatedNavbar />
        {children}
        <Footer />
      </CartProvider>
    </div>
  )
}