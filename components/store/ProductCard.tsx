'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/store'

export default function ProductCard({ product }: { product: Product }) {
    const [hovered, setHovered] = useState(false)
    const [imgError, setImgError] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    const [adding, setAdding] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleAction = async (e: React.MouseEvent, type: 'cart' | 'buy' | 'view') => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            router.push('/auth')
            return
        }

        if (type === 'view') {
            router.push(`/products/${product.slug}`)
            return
        }

        setAdding(true)
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: product.id, quantity: 1 })
            })

            if (res.ok) {
                if (type === 'buy') {
                    router.push('/cart')
                } else {
                    // Success feedback
                }
            }
        } catch (error) {
            console.error('Cart error:', error)
        } finally {
            setAdding(false)
        }
    }

    const mainImage = product.images?.[0]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover="cardHover"
            style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(212,175,55,0.03) 100%)',
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '8px',
                padding: isMobile ? '8px' : '12px',
                border: '1px solid rgba(255,255,255,0.03)',
                overflow: 'hidden',
                transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
        >
            {/* Atmospheric Chassis Glow (Animated on Hover) */}
            <motion.div
                variants={{
                    cardHover: { opacity: 1, scale: 1.1 }
                }}
                initial={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '10%',
                    right: '10%',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }}
            />
            {/* Visual Media Container */}
            <motion.div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                animate={{
                    y: hovered ? -10 : 0,
                    boxShadow: hovered ? '0 30px 60px rgba(0,0,0,0.5)' : '0 0 0 rgba(0,0,0,0)'
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    paddingBottom: '125%',
                    background: '#111',
                    borderRadius: '2px', // Sharper, professional corners
                    border: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                {/* Background Image with Cinematic Focus */}
                <motion.div
                    animate={{
                        scale: hovered ? 1.08 : 1,
                        filter: hovered ? 'brightness(0.6) blur(2px)' : 'brightness(0.8) blur(0px)'
                    }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'absolute', inset: 0, zIndex: 0 }}
                >
                    {mainImage && !imgError ? (
                        <img
                            src={mainImage}
                            alt={product.name}
                            onError={() => setImgError(true)}
                            style={{
                                width: '100%', height: '100%', objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: 'rgba(255,255,255,0.05)', fontSize: '8px',
                            letterSpacing: '0.4em', textTransform: 'uppercase'
                        }}>
                            Fragrance <br /> Archive
                        </div>
                    )}
                </motion.div>

                {/* Subtle Grain Overlay for Texture */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    background: 'url("https://grainy-gradients.vercel.app/noise.svg")',
                    opacity: 0.05, pointerEvents: 'none'
                }} />

                {/* Action Interface - Sliding Glassmorphism */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{
                        position: 'absolute', inset: 0,
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: isMobile ? '12px' : '30px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link
                            href={`/products/${product.slug}`}
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                background: '#fff',
                                color: '#000',
                                padding: isMobile ? '10px 0' : '16px 0',
                                textDecoration: 'none',
                                fontSize: isMobile ? '8px' : '10px',
                                fontWeight: 900,
                                letterSpacing: '0.4em',
                                textTransform: 'uppercase',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                            }}
                        >
                            EXPERIENCE
                        </Link>
                        <button
                            disabled={adding}
                            onClick={(e) => handleAction(e, 'cart')}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(10px)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: isMobile ? '10px 0' : '14px 0',
                                fontSize: isMobile ? '8px' : '9px',
                                fontWeight: 700,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                cursor: adding ? 'not-allowed' : 'pointer',
                                opacity: adding ? 0.6 : 1
                            }}
                        >
                            {adding ? (isMobile ? '...' : 'SYNCHRONIZING...') : 'ADD TO CART'}
                        </button>
                    </div>
                </motion.div>

                {/* Vertical Batch ID */}
                <div style={{
                    position: 'absolute', top: isMobile ? '12px' : '30px', right: isMobile ? '12px' : '30px',
                    fontSize: isMobile ? '6px' : '8px', color: '#d4af37',
                    letterSpacing: '0.4em', textTransform: 'uppercase',
                    fontWeight: 900, zIndex: 3, writingMode: 'vertical-rl',
                    opacity: hovered ? 0.2 : 0.6, transition: '0.5s'
                }}>
                    {isMobile ? `B-${product.id}` : `BATCH — REF.${product.id.toString().padStart(3, '0')}`}
                </div>
            </motion.div>

            {/* Typography Section */}
            <div style={{ padding: isMobile ? '12px 0' : '24px 0', textAlign: 'left' }}>
                <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                        fontSize: isMobile ? '7px' : '8px', color: '#666',
                        letterSpacing: '0.6em', marginBottom: '8px',
                        fontWeight: 400, textTransform: 'uppercase',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        fontFamily: 'var(--font-tenor)'
                    }}>
                        <div style={{
                            width: (hovered && !isMobile) ? '30px' : '0px',
                            height: '1px',
                            background: '#d4af37',
                            transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
                        }} />
                        {product.category}
                    </div>
                    <h3 style={{
                        margin: '0 0 8px', fontSize: isMobile ? '14px' : '18px', fontWeight: 300,
                        color: '#fff', fontFamily: 'var(--font-cormorant)',
                        letterSpacing: '0.02em', textTransform: 'none' // Allows admin casing
                    }}>
                        {product.name}
                    </h3>

                    {/* Price and Discount Tag */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '8px' : '12px',
                        marginBottom: isMobile ? '12px' : '20px',
                        fontFamily: 'var(--font-tenor)'
                    }}>
                        <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 500, color: '#d4af37' }}>
                            ₹ {product.price}
                        </span>
                        <span style={{
                            fontSize: isMobile ? '7px' : '9px',
                            color: '#d4af37',
                            padding: '2px 8px',
                            border: '1px solid rgba(212,175,55,0.3)',
                            borderRadius: '1px',
                            letterSpacing: '0.1em'
                        }}>
                            12% OFF
                        </span>
                    </div>
                </Link>

                {/* Integrated Static Controls for Accessibility - Theme Focused */}
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'row', // Side by side for both
                    gap: isMobile ? '6px' : '12px',
                    marginTop: isMobile ? '12px' : '20px',
                    background: 'transparent'
                }}>
                    <div onClick={(e) => handleAction(e, 'buy')} style={{ flex: 1 }}>
                        <motion.button
                            disabled={adding}
                            whileTap={isMobile ? { scale: 0.95 } : {}}
                            whileHover={!isMobile ? "hover" : ""}
                            initial="initial"
                            style={{
                                width: '100%',
                                background: isMobile ? '#d4af37' : 'rgba(255,255,255,0.02)',
                                color: isMobile ? '#000' : '#d4af37',
                                border: isMobile ? 'none' : '1px solid rgba(212,175,55,0.2)',
                                padding: isMobile ? '6px 0' : '14px 0',
                                fontSize: isMobile ? '9px' : '8px',
                                fontWeight: 900,
                                letterSpacing: isMobile ? '0.1em' : '0.3em',
                                textTransform: 'uppercase',
                                cursor: adding ? 'not-allowed' : 'pointer',
                                fontFamily: 'var(--font-tenor)',
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '2px'
                            }}
                        >
                            {!isMobile && (
                                <motion.div
                                    variants={{
                                        initial: { y: '100%' },
                                        hover: { y: 0 }
                                    }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ position: 'absolute', inset: 0, background: '#d4af37', zIndex: 0 }}
                                />
                            )}

                            <motion.div
                                variants={!isMobile ? {
                                    initial: { color: '#d4af37' },
                                    hover: { color: '#000' }
                                } : {}}
                                style={{ position: 'relative', zIndex: 1, color: isMobile ? '#000' : 'inherit' }}
                            >
                                <motion.span
                                    variants={!isMobile ? {
                                        initial: { y: 0, opacity: 1 },
                                        hover: { y: -20, opacity: 0 }
                                    } : {}}
                                    style={{ display: 'block', color: isMobile ? '#000' : 'inherit' }}
                                >
                                    {adding ? '...' : 'BUY'}
                                </motion.span>
                                {!isMobile && (
                                    <motion.span
                                        variants={{
                                            initial: { y: 20, opacity: 0 },
                                            hover: { y: 0, opacity: 1 }
                                        }}
                                        style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
                                    >
                                        {adding ? '...' : 'BUY'}
                                    </motion.span>
                                )}
                            </motion.div>
                        </motion.button>
                    </div>

                    <motion.button
                        disabled={adding}
                        onClick={(e) => handleAction(e, 'cart')}
                        whileTap={isMobile ? { scale: 0.95 } : {}}
                        whileHover={!isMobile ? "hover" : ""}
                        initial="initial"
                        style={{
                            flex: 1,
                            background: isMobile ? '#fff' : 'rgba(255,255,255,0.02)',
                            color: isMobile ? '#000' : '#d4af37',
                            border: isMobile ? 'none' : '1px solid rgba(212,175,55,0.2)',
                            padding: isMobile ? '6px 0' : '14px 0',
                            fontSize: isMobile ? '9px' : '8px',
                            fontWeight: 900,
                            letterSpacing: isMobile ? '0.1em' : '0.3em',
                            textTransform: 'uppercase',
                            cursor: adding ? 'not-allowed' : 'pointer',
                            fontFamily: 'var(--font-tenor)',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '2px'
                        }}
                    >
                        {!isMobile && (
                            <motion.div
                                variants={{
                                    initial: { y: '100%' },
                                    hover: { y: 0 }
                                }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                style={{ position: 'absolute', inset: 0, background: '#d4af37', zIndex: 0 }}
                            />
                        )}

                        <motion.div
                            variants={!isMobile ? {
                                initial: { color: '#d4af37' },
                                hover: { color: '#000' }
                            } : {}}
                            style={{ position: 'relative', zIndex: 1, color: isMobile ? '#000' : 'inherit' }}
                        >
                            <motion.span
                                variants={!isMobile ? {
                                    initial: { y: 0, opacity: 1 },
                                    hover: { y: -20, opacity: 0 }
                                } : {}}
                                style={{ display: 'block', color: isMobile ? '#000' : 'inherit' }}
                            >
                                {adding ? '...' : 'CART'}
                            </motion.span>
                            {!isMobile && (
                                <motion.span
                                    variants={{
                                        initial: { y: 20, opacity: 0 },
                                        hover: { y: 0, opacity: 1 }
                                    }}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
                                >
                                    {adding ? '...' : 'CART'}
                                </motion.span>
                            )}
                        </motion.div>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}
