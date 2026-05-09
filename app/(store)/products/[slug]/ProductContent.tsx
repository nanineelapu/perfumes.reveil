'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Product } from '@/types/store'
import { ShoppingBag, ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import { ReviewsSection } from '@/components/store/ReviewsSection'

interface ProductContentProps {
    product: Product
    initialReviews: any[]
}

export function ProductContent({ product, initialReviews }: ProductContentProps) {
    const [isMobile, setIsMobile] = useState(false)
    const [reviews, setReviews] = useState(initialReviews)
    const [selectedVolume, setSelectedVolume] = useState(product.technical_specs?.volume || '100ML')

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <main style={{
            background: '#000',
            minHeight: '100vh',
            color: '#fff',
            position: 'relative',
            padding: isMobile ? '100px 24px 60px' : '100px 100px 60px'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '40px' : '80px',
                alignItems: isMobile ? 'flex-start' : 'center',
                height: isMobile ? 'auto' : 'auto',
                minHeight: isMobile ? 'auto' : '80vh',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {/* Left: Balanced Image Container */}
                <div style={{ position: 'relative', width: isMobile ? '100%' : '48%', flex: 'none' }}>
                    {/* Background Glow Effect */}
                    {!isMobile && (
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: '120%', height: '120%',
                            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
                            zIndex: 0, pointerEvents: 'none'
                        }} />
                    )}

                    <motion.section
                        initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 1.2 }}
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '2px',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            background: '#050505',
                            width: '100%',
                            aspectRatio: isMobile ? '4/5' : '1/1',
                            zIndex: 1
                        }}
                    >
                        <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=1200'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            alt={product.name}
                        />

                        {/* Luxury Concentration Badge */}
                        <div style={{
                            position: 'absolute', top: isMobile ? '16px' : '24px', right: isMobile ? '16px' : '24px',
                            padding: '10px 20px', background: 'rgba(5,5,5,0.7)',
                            backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.4)',
                            fontSize: '9px', color: '#d4af37', letterSpacing: '0.25em',
                            textTransform: 'uppercase', fontWeight: 800, borderRadius: '1px'
                        }}>
                            {product.technical_specs?.concentration || 'Extrait de Parfum'}
                        </div>
                    </motion.section>
                </div>

                {/* Right: Theme-Based Content */}
                <section style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: isMobile ? '0' : '20px 0',
                    flex: 1
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 20 : 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                    >
                        <div style={{ marginBottom: isMobile ? '24px' : '40px' }}>
                            <Link href="/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', textDecoration: 'none', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontFamily: 'var(--font-tenor)', opacity: 0.8, transition: 'opacity 0.3s' }}>
                                <ArrowLeft size={14} /> Back to Shop
                            </Link>
                        </div>

                        <div style={{ fontSize: '11px', color: '#d4af37', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: isMobile ? '12px' : '20px', fontFamily: 'var(--font-tenor)', fontWeight: 600 }}>
                            {product.category || 'PARFUM'}
                        </div>

                        <h1 style={{
                            fontSize: isMobile ? '32px' : 'clamp(32px, 4vw, 56px)',
                            fontFamily: 'var(--font-baskerville)',
                            fontWeight: 400,
                            lineHeight: 1.1,
                            margin: isMobile ? '0 0 16px' : '0 0 12px',
                            letterSpacing: '-0.01em'
                        }}>
                            {product.name}
                        </h1>

                        {/* Rating Display */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={10}
                                        fill={product.rating >= s ? '#d4af37' : 'transparent'}
                                        color={product.rating >= s ? '#d4af37' : 'rgba(255,255,255,0.2)'}
                                    />
                                ))}
                            </div>
                            <span style={{ fontSize: '10px', color: '#666', letterSpacing: '0.1em' }}>
                                {product.rating || '0.0'} ({reviews.length} REVIEWS)
                            </span>
                        </div>

                        <div style={{ fontSize: isMobile ? '18px' : '20px', color: '#fff', fontFamily: 'var(--font-tenor)', marginBottom: isMobile ? '24px' : '32px', fontWeight: 300 }}>
                            ₹{product.price.toLocaleString()}
                        </div>

                        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#888', fontFamily: 'var(--font-tenor)', maxWidth: '480px', marginBottom: isMobile ? '32px' : '48px', fontWeight: 300 }}>
                            {product.description || 'Accessing encrypted olfactory data. This composition is part of the REVEIL Laboratory Archive, designed for high-end olfactory resonance.'}
                        </p>

                        {/* Olfactory Notes Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: isMobile ? '16px' : '32px',
                            marginBottom: isMobile ? '32px' : '48px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            paddingTop: '32px'
                        }}>
                            {[
                                { l: 'TOP', v: product.scent_profile?.top || '-' },
                                { l: 'HEART', v: product.scent_profile?.heart || '-' },
                                { l: 'BASE', v: product.scent_profile?.base || '-' }
                            ].map((note, i) => (
                                <div key={i}>
                                    <div style={{ fontSize: '9px', color: '#d4af37', letterSpacing: '0.3em', marginBottom: '10px', fontWeight: 600 }}>{note.l}</div>
                                    <div style={{ fontSize: '12px', color: '#fff', fontFamily: 'var(--font-tenor)' }}>{note.v}</div>
                                </div>
                            ))}
                        </div>

                        {/* Technical Meta */}
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '32px' : '64px', marginBottom: isMobile ? '32px' : '44px' }}>
                            <div>
                                <div style={{ fontSize: '8px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.2em', fontWeight: 600 }}>Select Size</div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {['50ML', '100ML'].map((v) => (
                                        <motion.button
                                            key={v}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedVolume(v)}
                                            style={{
                                                padding: '8px 16px',
                                                fontSize: '10px',
                                                background: selectedVolume === v ? '#d4af37' : 'transparent',
                                                border: `1px solid ${selectedVolume === v ? '#d4af37' : 'rgba(212,175,55,0.3)'}`,
                                                color: selectedVolume === v ? '#000' : '#fff',
                                                cursor: 'pointer',
                                                letterSpacing: '0.1em',
                                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                                fontWeight: selectedVolume === v ? 700 : 400
                                            }}
                                        >
                                            {v}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '8px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.2em', fontWeight: 600 }}>Lasts for</div>
                                <div style={{ fontSize: '11px', color: '#fff', padding: '8px 0' }}>{product.technical_specs?.longevity || '12 HRS+'}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <motion.button
                                whileHover={{ backgroundColor: '#d4af37', color: '#000', borderColor: '#d4af37' }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    flex: 1,
                                    background: 'rgba(10, 10, 10, 0.6)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(212, 175, 55, 0.3)',
                                    color: '#fff',
                                    padding: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            >
                                BUY NOW
                            </motion.button>
                            <motion.button
                                whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: '#d4af37' }}
                                style={{
                                    width: '60px',
                                    background: 'rgba(10, 10, 10, 0.6)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(212, 175, 55, 0.2)',
                                    color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            >
                                <ShoppingBag size={18} strokeWidth={1} />
                            </motion.button>
                        </div>
                    </motion.div>
                </section>
            </div>

            {/* Reviews Section */}
            <div style={{
                marginTop: '100px',
                borderTop: '1px solid rgba(255,255,255,0.03)',
                paddingTop: '60px',
                background: 'linear-gradient(to bottom, rgba(212,175,55,0.02), transparent)'
            }}>
                <ReviewsSection reviews={reviews} />
            </div>
        </main>
    )
}
