'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Trash2, Loader2, ChevronRight, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Footer } from '@/components/store/Footer'

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
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
                <Loader2 className="animate-spin" size={32} color="#d4af37" />
            </div>
        )
    }

    if (!user) {
        return (
            <main style={{ background: '#050505', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '450px', padding: '0 24px' }}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ marginBottom: '40px' }}
                    >
                        <Heart size={64} strokeWidth={1} style={{ margin: '0 auto', color: '#d4af37', opacity: 0.3 }} />
                    </motion.div>
                    <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-baskerville)', marginBottom: '16px', fontWeight: 300, letterSpacing: '0.05em' }}>Your Collection Awaits</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: 1.8, marginBottom: '40px', letterSpacing: '0.02em', fontFamily: 'var(--font-baskerville)', fontStyle: 'italic' }}>
                        Curate your personal archive of scents. Sign in to save and access your desired fragrances across all devices.
                    </p>
                    <Link href="/auth" style={{
                        background: '#d4af37', color: '#000', padding: '20px 56px',
                        borderRadius: '2px', textDecoration: 'none', fontSize: '12px',
                        fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em',
                        display: 'inline-block', boxShadow: '0 20px 40px rgba(212,175,55,0.1)'
                    }}>
                        Login to my Account
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main style={{ background: '#050505', minHeight: '100vh', color: '#fff', paddingTop: isMobile ? '100px' : '160px', paddingBottom: '120px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

                {/* Header */}
                <header style={{ marginBottom: isMobile ? '60px' : '100px', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#d4af37', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6em', marginBottom: '24px', fontFamily: 'var(--font-baskerville)' }}
                    >
                        <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.2)' }} /> 
                        Private Archive 
                        <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.2)' }} />
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
                        color: 'rgba(255,255,255,0.3)',
                        marginTop: '32px',
                        fontSize: isMobile ? '14px' : '18px',
                        fontFamily: 'var(--font-baskerville)',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        maxWidth: '600px',
                        margin: '32px auto 0'
                    }}>A curated selection of olfactory masterpieces reserved for your collection.</p>
                </header>

                {/* Wishlist Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))', 
                    gap: '40px' 
                }}>
                    {items.length > 0 ? (
                        items.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    background: 'linear-gradient(180deg, #111 0%, #080808 100%)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    disabled={removingId === item.id}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '2px',
                                        cursor: 'pointer',
                                        zIndex: 10,
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)'
                                        e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.3)'
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                                    }}
                                >
                                    {removingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} strokeWidth={1.5} />}
                                </button>

                                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%' }}>
                                    {/* Image Section */}
                                    <div style={{ 
                                        width: isMobile ? '100%' : '140px', 
                                        height: isMobile ? '240px' : 'auto',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        background: '#000'
                                    }}>
                                        <img 
                                            src={item.products?.images?.[0]} 
                                            alt={item.products?.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                                        />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.5))' }} />
                                    </div>

                                    {/* Content Section */}
                                    <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ marginBottom: '24px' }}>
                                            <p style={{ fontSize: '9px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '8px', fontFamily: 'var(--font-baskerville)' }}>{item.products?.category}</p>
                                            <h3 style={{ fontSize: '24px', fontWeight: 300, margin: '0 0 12px', fontFamily: 'var(--font-baskerville)', color: '#fff', letterSpacing: '0.02em' }}>{item.products?.name}</h3>
                                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontFamily: 'var(--font-baskerville)', fontStyle: 'italic' }}>
                                                {item.products?.description?.slice(0, 80)}...
                                            </p>
                                        </div>

                                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <p style={{ fontSize: '20px', fontWeight: 400, color: '#d4af37', fontFamily: 'var(--font-baskerville)' }}>₹{item.products?.price.toLocaleString()}</p>
                                            <button 
                                                onClick={() => addToCart(item.product_id)}
                                                style={{ 
                                                    background: '#fff', 
                                                    color: '#000', 
                                                    border: 'none', 
                                                    padding: '12px 24px', 
                                                    borderRadius: '2px', 
                                                    fontSize: '10px', 
                                                    fontWeight: 900, 
                                                    textTransform: 'uppercase', 
                                                    letterSpacing: '0.2em', 
                                                    cursor: 'pointer',
                                                    fontFamily: 'var(--font-baskerville)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                            >
                                                Acquire <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '120px 0', background: '#111', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                            <div style={{ marginBottom: '32px' }}>
                                <ShoppingBag size={48} strokeWidth={1} style={{ margin: '0 auto', color: 'rgba(255,255,255,0.1)' }} />
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '20px', fontFamily: 'var(--font-baskerville)', fontStyle: 'italic', letterSpacing: '0.05em' }}>Your archive is currently empty.</p>
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
                                Explore Fragrances
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
                        background: 'linear-gradient(135deg, #111 0%, #050505 100%)',
                        border: '1px solid rgba(255,255,255,0.03)'
                    }}>
                        <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 300, margin: 0, fontFamily: 'var(--font-baskerville)', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#fff' }}>Complete the Ensemble</h2>
                        <p style={{
                            color: 'rgba(255,255,255,0.4)',
                            fontSize: '16px',
                            marginTop: '24px',
                            maxWidth: '600px',
                            margin: '24px auto',
                            lineHeight: 1.8,
                            fontFamily: 'var(--font-baskerville)',
                            fontStyle: 'italic'
                        }}>Our curators suggest exploring these complementary notes to enhance your olfactory presence.</p>
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
                            View Curated Collections <ChevronRight size={16} />
                        </Link>
                    </div>
                )}

            </div>
            <Footer />
        </main>
    )
}
