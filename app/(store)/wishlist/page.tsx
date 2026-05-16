'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Trash2, Loader2, ChevronRight, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Footer } from '@/components/store/Footer'
import { PremiumLoader } from '@/components/store/PremiumLoader'

interface WishlistItem {
  id: string
  product_id: string
  products: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    category: string
    description: string
  }
}

export default function WishlistPage() {
  const supabase = createClient()
  const router = useRouter()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }
      setUser(user)

      const res = await fetch('/api/wishlist')
      const data = await res.json()
      if (data.items) {
        setItems(data.items)
      }
      setLoading(false)
    }

    fetchData()

    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [supabase])

  const removeFromWishlist = async (id: string) => {
    setRemovingId(id)
    try {
      const res = await fetch(`/api/wishlist?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems(items.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemovingId(null)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      })
      if (res.ok) {
        router.push('/cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  if (loading) {
    return <PremiumLoader iconName="heart" text="Curating Favorites" />
  }

  if (!user) {
    return (
      <main style={{ background: '#f8f7f2', minHeight: '100vh', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '450px', padding: '0 24px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ marginBottom: '40px' }}
          >
            <Heart size={64} strokeWidth={1} style={{ margin: '0 auto', color: '#d4af37', opacity: 0.3 }} />
          </motion.div>
          <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-baskerville)', marginBottom: '16px', fontWeight: 300, letterSpacing: '0.05em' }}>Save Your Favorites</h2>
          <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '15px', lineHeight: 1.8, marginBottom: '40px', letterSpacing: '0.02em', fontFamily: 'var(--font-baskerville)', fontStyle: 'italic' }}>
            Sign in to save products and view them on any device.
          </p>
          <Link href="/auth" style={{
            background: '#d4af37', color: '#000', padding: '20px 56px',
            borderRadius: '2px', textDecoration: 'none', fontSize: '12px',
            fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em',
            display: 'inline-block', boxShadow: '0 20px 40px rgba(212,175,55,0.15)'
          }}>
            Sign In
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ background: '#f8f7f2', minHeight: '100vh', color: '#1a1a1a', paddingTop: isMobile ? '100px' : '160px', paddingBottom: '120px' }}>
      {/* HIDDEN SEO HEADINGS - GOD LEVEL SEO */}
      <div className="sr-only">
        <h1>Your REVEIL Fragrance Wishlist - Curated Luxury Perfumes</h1>
        <h2>Save Best Long Lasting Perfumes and Designer Scents - Personalized Collection</h2>
        <p>Keep track of your favorite laboratory fragrances, Oudh, and Musk scents. Create a curated list of high-end perfumes for your next purchase at REVEIL.</p>
        <h3>Buy Premium Attars and Niche Perfumes Online India - Save Your Favorite Signature Scents</h3>
        <h4>REVEIL Wishlist - Bookmark Handcrafted Eau de Parfum, Oudh, Musk and Designer Body Sprays</h4>
        <h5>Personalized Fragrance Shortlist - Shop Long Lasting Luxury Perfumes for Men and Women at REVEIL Laboratory</h5>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <header style={{ marginBottom: isMobile ? '40px' : '60px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#d4af37', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6em', marginBottom: '16px', fontFamily: 'var(--font-baskerville)' }}
          >
            <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.3)' }} />
            SAVED ITEMS
            <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.3)' }} />
          </motion.div>
          <h1 style={{
            fontSize: isMobile ? '48px' : '84px',
            fontFamily: 'var(--font-baskerville)',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '-0.02em',
            fontWeight: 300,
            lineHeight: 0.9
          }}>
            Your <span style={{ color: '#d4af37', fontStyle: 'italic', fontWeight: 400 }}>WISHLIST</span>
          </h1>
          <p style={{
            color: 'rgba(0,0,0,0.5)',
            marginTop: '16px',
            fontSize: isMobile ? '14px' : '18px',
            fontFamily: 'var(--font-baskerville)',
            fontStyle: 'italic',
            fontWeight: 400,
            maxWidth: '600px',
            margin: '16px auto 0'
          }}>
            A list of products you've saved to buy later.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <div style={{
              padding: '10px 24px',
              background: 'rgba(212,175,55,0.05)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }} />
              <span style={{ fontSize: '9px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {items.length.toString().padStart(2, '0')} Items Saved
              </span>
            </div>
          </div>
        </header>


        {/* Wishlist Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.4s ease, border-color 0.4s ease'
                }}
                whileHover={{ y: -5, borderColor: 'rgba(212,175,55,0.4)' }}
              >
                {/* Collection Index */}
                <div style={{
                  position: 'absolute',
                  bottom: '100px',
                  right: '-10px',
                  fontSize: '80px',
                  fontWeight: 900,
                  color: 'rgba(0,0,0,0.04)',
                  zIndex: 0,
                  fontFamily: 'var(--font-tenor)',
                  pointerEvents: 'none'
                }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                {/* Image Container */}
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#f3eee2'
                }}>
                  <img
                    src={item.products?.images?.[0]}
                    alt={item.products?.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                  />

                  {/* Glass Overlay for Category */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 12px',
                    borderRadius: '2px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <p style={{ fontSize: '8px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.3em', margin: 0, fontWeight: 900 }}>{item.products?.category}</p>
                  </div>

                  {/* Availability Tag */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 8px',
                    borderRadius: '2px'
                  }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4ade80' }} />
                    <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.8)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>In Stock</span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={removingId === item.id}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      zIndex: 10,
                      transition: '0.3s'
                    }}
                  >
                    {removingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} strokeWidth={1.5} />}
                  </button>
                </div>

                {/* Info Section */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 300, margin: '0 0 6px', fontFamily: 'var(--font-tenor)', color: '#1a1a1a', letterSpacing: '0.05em' }}>{item.products?.name}</h3>
                    <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.4, fontFamily: 'var(--font-tenor)', letterSpacing: '0.02em', height: '30px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.products?.description}
                    </p>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', fontFamily: 'var(--font-tenor)' }}>₹{item.products?.price.toLocaleString()}</p>
                    <button
                      onClick={() => addToCart(item.product_id)}
                      style={{
                        background: '#d4af37',
                        color: '#000',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '999px',
                        fontSize: '9px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: '0.3s'
                      }}
                    >
                      BUY NOW <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '120px 0', background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '4px' }}>
              <div style={{ marginBottom: '32px' }}>
                <ShoppingBag size={48} strokeWidth={1} style={{ margin: '0 auto', color: 'rgba(0,0,0,0.2)' }} />
              </div>
              <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '20px', fontFamily: 'var(--font-baskerville)', fontStyle: 'italic', letterSpacing: '0.05em' }}>Your wishlist is empty.</p>
              <Link href="/products" style={{
                background: '#d4af37',
                color: '#000',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                marginTop: '40px',
                display: 'inline-block',
                textDecoration: 'none',
                padding: '18px 48px',
                borderRadius: '2px'
              }}>
                Go to Shop
              </Link>
            </div>
          )}
        </div>

        {/* Recommendations Callout */}
        {items.length > 0 && (
          <div style={{
            marginTop: isMobile ? '100px' : '160px',
            textAlign: 'center',
            padding: isMobile ? '60px 24px' : '100px 40px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f3eee2 100%)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 300, margin: 0, fontFamily: 'var(--font-baskerville)', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1a1a1a' }}>Recommended for You</h2>
            <p style={{
              color: 'rgba(0,0,0,0.5)',
              fontSize: '16px',
              marginTop: '24px',
              maxWidth: '600px',
              margin: '24px auto',
              lineHeight: 1.8,
              fontFamily: 'var(--font-baskerville)',
              fontStyle: 'italic'
            }}>We think you'll love these items based on your saved products.</p>
            <Link href="/products" style={{
              color: '#d4af37',
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.4em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '40px'
            }}>
              Browse Shop <ChevronRight size={16} />
            </Link>
          </div>
        )}

      </div>

    </main>
  )
}
