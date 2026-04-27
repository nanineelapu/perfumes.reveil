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
            padding: isMobile ? '100px 24px 60px' : '120px 100px 60px'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '40px' : '80px',
                alignItems: isMobile ? 'flex-start' : 'stretch',
                height: isMobile ? 'auto' : '75vh',
                minHeight: isMobile ? 'auto' : '600px'
            }}>
                {/* Left: Balanced Image Container */}
                <motion.section
                    initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.2 }}
                    style={{
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.05)',
                        background: '#050505',
                        width: isMobile ? '100%' : '50%',
                        aspectRatio: isMobile ? '4/5' : 'auto',
                        flex: isMobile ? 'none' : 1
                    }}
                >
                    <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=1200'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={product.name}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' }} />
                </motion.section>

                {/* Right: Theme-Based Content */}
                <section style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: isMobile ? 'flex-start' : 'center',
                    padding: isMobile ? '0' : '40px 0',
                    flex: isMobile ? 'none' : 1.1
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 20 : 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                    >
                        <div style={{ marginBottom: isMobile ? '24px' : '40px' }}>
                            <Link href="/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', textDecoration: 'none', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontFamily: 'var(--font-tenor)', opacity: 0.8, transition: 'opacity 0.3s' }}>
                                <ArrowLeft size={14} /> Return to Products
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
                        <div style={{ display: 'flex', gap: isMobile ? '32px' : '48px', marginBottom: isMobile ? '40px' : '56px' }}>
                            <div>
                                <div style={{ fontSize: '9px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.2em', fontWeight: 600 }}>Volume</div>
                                <div style={{ fontSize: '12px', color: '#fff' }}>{product.technical_specs?.volume || '100ML'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '9px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.2em', fontWeight: 600 }}>Longevity</div>
                                <div style={{ fontSize: '12px', color: '#fff' }}>{product.technical_specs?.longevity || '12 HRS+'}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <motion.button
                                whileHover={{ backgroundColor: '#fff', color: '#000' }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    flex: 1, background: 'transparent', border: '1px solid #fff', color: '#fff',
                                    padding: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em', cursor: 'pointer', transition: 'all 0.3s'
                                }}
                            >
                                ACQUIRE_PRODUCT
                            </motion.button>
                            <motion.button
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                style={{
                                    width: '60px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                }}
                            >
                                <ShoppingBag size={18} strokeWidth={1} />
                            </motion.button>
                        </div>
                    </motion.div>
                </section>
            </div>

            {/* Bottom Meta */}
            <div style={{
                position: isMobile ? 'relative' : 'absolute',
                bottom: isMobile ? 'auto' : '40px',
                left: isMobile ? 'auto' : '100px',
                marginTop: isMobile ? '60px' : '0',
                opacity: 0.2,
                fontSize: '9px',
                letterSpacing: '0.3em',
                textAlign: isMobile ? 'center' : 'left'
            }}>
                ID: {product.id.toString().padStart(4, '0')} — STUDIO_REVEIL_FRAGMENT
            </div>

            {/* Reviews Section */}
            <div style={{ marginTop: '120px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '80px' }}>
                <ReviewsSection reviews={reviews} />
            </div>
        </main>
    )
}
