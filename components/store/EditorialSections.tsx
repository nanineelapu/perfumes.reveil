'use client'
import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { AnimatedPageSection } from './AnimatedPageSection'
import { Collection } from '@/types/store'

/**
 * Philosophy: Artisan Series
 */
export function PhilosophySection() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <AnimatedPageSection delay={0.2} style={{
            padding: isMobile ? '40px 24px' : 'clamp(40px, 6vw, 80px) clamp(20px, 6vw, 80px)',
            background: '#f8f7f2',
            color: '#1a1a1a',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* Dynamic Background Text */}
            <motion.div
                style={{
                    position: 'absolute', top: '50%', left: '0',
                    transform: 'translateY(-50%)',
                    fontSize: 'clamp(60px, 12vw, 180px)', fontWeight: 900, color: 'rgba(0,0,0,0.02)',
                    letterSpacing: '-0.05em', zIndex: 0, pointerEvents: 'none',
                    whiteSpace: 'nowrap', textTransform: 'uppercase',
                    fontFamily: 'var(--font-baskerville)'
                }}
                animate={{ x: ['10%', '-30%', '10%'] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                Authenticity
            </motion.div>

            {/* Side Headings */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 0.4, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                style={{
                    position: 'absolute', right: 'clamp(20px, 4vw, 60px)', top: '50%', transform: 'translateY(-50%)',
                    writingMode: 'vertical-rl',
                    textTransform: 'uppercase',
                    letterSpacing: '1em',
                    fontSize: '8px',
                    fontWeight: 600,
                    color: '#d4af37',
                    fontFamily: 'var(--font-baskerville)',
                    zIndex: 2
                }}>
                Reveil / Philosophy — Artisan Series
            </motion.div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1.5fr 0.5fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
                    alignItems: 'center',
                    gap: isMobile ? '24px' : 'clamp(30px, 6vw, 60px)',
                    textAlign: isMobile ? 'left' : 'left'
                }}>
                    <div style={{ maxWidth: isMobile ? '100%' : '700px', display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            style={{
                                fontSize: isMobile ? '9px' : '9px',
                                textTransform: 'uppercase',
                                letterSpacing: isMobile ? '0.6em' : '0.8em',
                                marginBottom: isMobile ? '16px' : '32px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#d4af37'
                            }}
                        >
                            Process <span style={{ width: isMobile ? '20px' : '30px', height: '1px', background: '#d4af37' }} />
                        </motion.div>

                        <h2 style={{
                            fontSize: isMobile ? '18px' : 'clamp(22px, 3.2vw, 38px)',
                            fontFamily: 'var(--font-baskerville)',
                            lineHeight: 1.4,
                            fontWeight: 400,
                            letterSpacing: '-0.01em',
                            margin: 0,
                            color: '#1a1a1a',
                            maxWidth: isMobile ? '100%' : '680px'
                        }}>
                            {"Elevated perfumes crafted with natural extraits and made with artisanal care. Timeless and sensory experiences.".split(' ').map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.8,
                                        delay: i * 0.03,
                                        ease: [0.215, 0.61, 0.355, 1]
                                    }}
                                    style={{ display: 'inline-block', marginRight: '0.25em' }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 1 }}
                            style={{ marginTop: isMobile ? '24px' : '48px' }}
                        >
                            <Link href="/about" style={{
                                fontSize: isMobile ? '9px' : '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.4em',
                                color: '#1a1a1a',
                                textDecoration: 'none',
                                borderBottom: '1px solid #d4af37',
                                paddingBottom: '6px'
                            }}>
                                OUR STORY
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'relative',
                            height: isMobile ? '120px' : 'clamp(290px, 28vw, 380px)',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}
                    >
                        <img
                            src="https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/Untitled%20%281%29.png"
                            alt="Reveil Artistry"
                            style={{
                                width: isMobile ? '100%' : '100%',
                                height: isMobile ? '100%' : '100%',
                                objectFit: 'contain',
                                filter: 'contrast(1.05) brightness(0.98)'
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </AnimatedPageSection>
    )
}

/**
 * The Collections: Horizontal Editorial Scroll
 */
export function NotesSection() {
    const containerRef = useRef(null)
    const [collections, setCollections] = useState<Collection[]>([])
    const [isMobile, setIsMobile] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
    }, [])

    const handleAction = (e: React.MouseEvent, path: string) => {
        e.preventDefault()
        e.stopPropagation()
        if (!user) {
            router.push('/auth')
            return
        }
        router.push(path)
    }

    useEffect(() => {
        fetch('/api/collections')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCollections(data)
                } else {
                    setCollections([])
                }
            })
            .catch(err => {
                console.error('Failed to fetch collections:', err)
                setCollections([])
            })
    }, [])

    return (
        <section ref={containerRef} style={{
            padding: isMobile ? '40px 24px' : '80px 80px',
            background: '#0a0a0a',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>

                {/* Header */}
                <div style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    gap: isMobile ? '24px' : '40px',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    {!isMobile && (
                        <div
                            style={{
                                fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.6em',
                                color: '#d4af37', writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                                fontFamily: 'var(--font-baskerville)', paddingRight: '20px', borderRight: '1px solid rgba(212,175,55,0.3)'
                            }}
                        >
                            EST. 2026
                        </div>
                    )}

                    <div style={{ flex: 1 }}>
                        <span
                            style={{
                                fontSize: isMobile ? '9px' : '12px', textTransform: 'uppercase', letterSpacing: isMobile ? '0.6em' : '1em',
                                color: '#fff', display: 'block', marginBottom: '12px', opacity: 0.5
                            }}
                        >
                            Curated Series
                        </span>
                        <h2
                            style={{
                                fontSize: isMobile ? 'clamp(22px, 6vw, 28px)' : 'clamp(24px, 4vw, 48px)',
                                fontFamily: 'var(--font-baskerville)',
                                color: '#fff', margin: 0, letterSpacing: '-0.02em',
                                lineHeight: 1
                            }}
                        >
                            THE <span style={{ color: '#d4af37' }}>COLLECTIONS</span>
                        </h2>
                    </div>

                    {!isMobile && (
                        <div style={{ maxWidth: '350px', position: 'absolute', right: 0, bottom: 0, textAlign: 'right' }}>
                            <p style={{
                                fontSize: '14px', color: '#666', fontWeight: 300,
                                lineHeight: 1.6, margin: 0, fontStyle: 'italic',
                                fontFamily: 'var(--font-baskerville)'
                            }}>
                                Meticulously crafted universes. Distinct olfactory journeys.
                            </p>
                        </div>
                    )}
                </div>

                {/* Editorial Collection Scroll */}
                <div style={{
                    display: isMobile ? 'flex' : 'grid',
                    gridTemplateColumns: !isMobile ? 'repeat(4, 1fr)' : 'none',
                    gap: isMobile ? '16px' : '20px',
                    overflowX: isMobile ? 'auto' : 'visible',
                    paddingBottom: isMobile ? '20px' : '0',
                    scrollSnapType: isMobile ? 'x mandatory' : 'none',
                    WebkitOverflowScrolling: 'touch',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    margin: isMobile ? '0 -24px' : '0',
                    padding: isMobile ? '0 24px' : '0'
                }}>
                    <style>{`
                        div::-webkit-scrollbar { display: none; }
                    `}</style>
                    {Array.isArray(collections) && collections.map((item, i) => (
                        <div
                            key={item.name}
                            style={{
                                position: 'relative',
                                height: isMobile ? '340px' : '380px',
                                minWidth: isMobile ? '280px' : 'auto',
                                flex: isMobile ? '0 0 auto' : 'auto',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                scrollSnapAlign: 'start',
                                boxShadow: isMobile ? '0 10px 30px rgba(0,0,0,0.3)' : 'none'
                            }}
                        >
                            <div onClick={(e) => handleAction(e, '/products')} style={{ display: 'block', height: '100%' }}>
                                <motion.div
                                    whileHover={!isMobile ? "hover" : ""}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <motion.img
                                        variants={{
                                            hover: { scale: 1.1 }
                                        }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        src={item.image_url}
                                        style={{
                                            width: '100%', height: '100%', objectFit: 'cover',
                                            filter: 'brightness(0.7)'
                                        }}
                                    />

                                    {/* Desktop Hover Reveal */}
                                    {!isMobile && (
                                        <motion.div
                                            variants={{
                                                hover: { opacity: 1 }
                                            }}
                                            initial={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                position: 'absolute', inset: 0,
                                                background: 'radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, transparent 80%)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <motion.div
                                                variants={{
                                                    hover: { opacity: 1, scale: 1 }
                                                }}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                style={{
                                                    background: '#d4af37', color: '#000',
                                                    padding: '12px 24px', fontSize: '9px',
                                                    fontWeight: 900, textTransform: 'uppercase',
                                                    letterSpacing: '0.2em'
                                                }}
                                            >
                                                Explore
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* Label Area */}
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        padding: isMobile ? '32px 24px' : '24px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px'
                                    }}>
                                        <div style={{
                                            fontSize: isMobile ? '9px' : '8px', color: '#d4af37',
                                            letterSpacing: '0.4em', marginBottom: '4px',
                                            fontFamily: 'var(--font-baskerville)',
                                            textTransform: 'uppercase',
                                            opacity: 0.8
                                        }}>
                                            {item.type}
                                        </div>
                                        <div style={{
                                            fontSize: isMobile ? '20px' : '16px', color: '#fff',
                                            fontWeight: 400, fontFamily: 'var(--font-baskerville)',
                                            letterSpacing: '0.02em',
                                            lineHeight: 1.2
                                        }}>
                                            {item.name}
                                        </div>

                                        {/* Mobile-Only Explore CTA */}
                                        {isMobile && (
                                            <div style={{
                                                marginTop: '16px',
                                                fontSize: '10px',
                                                color: '#d4af37',
                                                fontWeight: 500,
                                                letterSpacing: '0.2em',
                                                textTransform: 'uppercase',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                borderTop: '1px solid rgba(212,175,55,0.2)',
                                                paddingTop: '16px'
                                            }}>
                                                View Journey <span style={{ fontSize: '14px' }}>→</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Scroll Hint & Sub-label (Bottom) */}
                {isMobile && (
                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                        <span
                            style={{
                                fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1em',
                                color: '#fff', display: 'block', marginBottom: '20px', opacity: 0.4
                            }}
                        >
                            Curated Series
                        </span>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '24px',
                            color: '#d4af37',
                            opacity: 0.6,
                            fontSize: '16px'
                        }}>
                            <div>←</div>
                            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4em', alignSelf: 'center' }}>Swipe</div>
                            <div>→</div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

/**
 * Brand Showcase: The Premier Showroom
 */
export function BrandShowcaseSection() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const brands = [
        { name: 'BOMBAY SHAVING CO', logo: '/brands/bombay.png' },
        { name: 'BELLA VITA', logo: '/brands/bellavita.png' },
        { name: 'THE MAN COMPANY', logo: '/brands/man_company.png' },
        { name: 'BEARDO', logo: '/brands/beardo.png' },
        { name: 'WILD STONE', logo: 'https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2019%2C%202026%2C%2009_01_25%20PM.webp' },
        { name: 'MEENA', logo: '/brands/meena-logo.png' },
    ]

    return (
        <section style={{
            padding: isMobile ? '40px 24px' : '60px 80px',
            background: '#050505',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* Minimalist Heading */}
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '60px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {!isMobile && (
                            <span style={{
                                fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1.2em',
                                color: '#d4af37', display: 'block', marginBottom: '16px',
                                fontFamily: 'var(--font-baskerville)'
                            }}>
                                Exquisite Curation
                            </span>
                        )}
                        <h2 style={{
                            fontSize: isMobile ? '18px' : 'clamp(24px, 4vw, 36px)',
                            fontFamily: 'var(--font-baskerville)',
                            color: '#fff', margin: 0, letterSpacing: isMobile ? '0.15em' : '0.1em',
                            textTransform: 'uppercase',
                            whiteSpace: isMobile ? 'nowrap' : 'normal'
                        }}>
                            THE PREMIER <span style={{ color: '#d4af37' }}>CURATION</span>
                        </h2>
                    </motion.div>
                </div>

                {/* Grid - 6 Distinct Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
                    gap: isMobile ? '6px' : '16px'
                }}>
                    {brands.map((brand, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{
                                duration: 1,
                                delay: i * 0.15,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            style={{
                                position: 'relative',
                                height: isMobile ? '100px' : '180px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.04)',
                                borderRadius: '1px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Link href={`/products?search=${encodeURIComponent(brand.name)}`} style={{ textDecoration: 'none', width: '100%', height: '100%' }}>
                                <motion.div
                                    whileHover="hover"
                                    style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {brand.logo ? (
                                        <motion.img
                                            variants={{ hover: { scale: 1.1 } }}
                                            src={brand.logo}
                                            style={{
                                                width: isMobile ? '90%' : '80%',
                                                height: isMobile ? '90%' : '80%',
                                                objectFit: 'contain',
                                                filter: 'brightness(0.7) grayscale(0.5)',
                                                transition: 'all 0.4s ease'
                                            }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '32px', color: '#d4af37', opacity: 0.6 }}>{brand.name[0]}</span>
                                    )}

                                    {/* Hover Spotlight Overlay */}
                                    <motion.div
                                        variants={{ hover: { opacity: 1 } }}
                                        initial={{ opacity: 0 }}
                                        style={{
                                            position: 'absolute', inset: 0,
                                            background: 'radial-gradient(circle at center, rgba(212,175,55,0.06) 0%, transparent 80%)',
                                            pointerEvents: 'none'
                                        }}
                                    />

                                    {/* Subtle Label */}
                                    <motion.div
                                        variants={!isMobile ? { hover: { opacity: 1, y: -10 } } : {}}
                                        initial={isMobile ? { opacity: 1, y: -8 } : { opacity: 0, y: 0 }}
                                        style={{
                                            position: 'absolute', bottom: '12px',
                                            fontSize: isMobile ? '7px' : '8px', color: '#fff',
                                            fontFamily: 'var(--font-baskerville)',
                                            letterSpacing: '0.15em',
                                            textAlign: 'center', width: '100%',
                                            zIndex: 2,
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {brand.name}
                                    </motion.div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Sub-label (Bottom) */}
            </div>
        </section>
    )
}

/**
 * Reveil Collection: Restored Noir Red Visuals
 */
export function ReveilCollectionSection() {
    const containerRef = useRef(null)
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
    }, [])

    // Parallax Transforms
    const imageScale = useTransform(smoothProgress, [0, 1], [1.1, 1])
    const titleY = useTransform(smoothProgress, [0, 1], [0, -50])
    const labelX = useTransform(smoothProgress, [0, 1], [-100, 100])

    return (
        <section ref={containerRef} style={{
            background: '#050505',
            padding: isMobile ? '40px 20px' : '100px 80px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    minHeight: isMobile ? 'auto' : '85vh',
                    position: 'relative',
                    borderRadius: isMobile ? '24px' : '48px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 80px 160px rgba(0,0,0,1)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: isMobile ? '24px 0' : '0'
                }}
            >
                <motion.div
                    style={{
                        position: 'absolute', inset: 0, zIndex: 0,
                        scale: imageScale
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=2000"
                        alt="Reveil Collection"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.9) 100%)'
                    }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
                    }} />
                </motion.div>

                <div style={{
                    maxWidth: '1200px',
                    width: '100%',
                    margin: '0 auto',
                    padding: isMobile ? '0 24px' : '0 60px',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1.3fr 0.7fr',
                        gap: isMobile ? '40px' : '80px',
                        alignItems: 'center',
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        <motion.div style={{ y: titleY, position: 'relative' }}>
                            <span style={{
                                fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.4em',
                                color: '#d4af37', display: 'block', marginBottom: '28px',
                                fontFamily: 'var(--font-baskerville)'
                            }}>
                                L U X U R Y — E D I T I O N
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(40px, 6vw, 80px)',
                                fontFamily: 'var(--font-baskerville)',
                                color: '#fff', margin: 0, lineHeight: 0.85,
                                letterSpacing: '-0.02em', textTransform: 'uppercase'
                            }}>
                                REVEIL <br />
                                <span style={{ color: 'transparent', WebkitTextStroke: '1.2px rgba(255,255,255,0.5)', fontFamily: 'var(--font-baskerville)', fontStyle: 'italic', fontWeight: 400 }}>Collection</span>
                            </h2>
                            <motion.div
                                style={{
                                    x: labelX, opacity: 0.08, fontSize: '180px', fontWeight: 900,
                                    position: 'absolute', top: '-50px', left: '-20px',
                                    pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: -1, color: '#fff'
                                }}
                            >
                                ESTATE
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2 }}
                            style={{
                                padding: isMobile ? '32px 24px' : '48px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '4px',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                justifySelf: isMobile ? 'center' : 'end',
                                width: isMobile ? '100%' : 'auto'
                            }}
                        >
                            <h3 style={{
                                fontSize: '22px', color: '#fff',
                                fontFamily: 'var(--font-baskerville)', fontStyle: 'italic',
                                fontWeight: 400, marginBottom: '20px', lineHeight: 1.4
                            }}>
                                "The best natural perfumes."
                            </h3>
                            <p style={{
                                color: '#bbb', fontSize: '14px', lineHeight: 1.8,
                                marginBottom: '40px', fontWeight: 300,
                                fontFamily: 'var(--font-baskerville)'
                            }}>
                                The Reveil Signature collection features our finest luxury scents.
                                Made for those who love high-quality fragrance.
                            </p>

                            <motion.div
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (!user) { router.push('/auth'); return; }
                                    router.push('/products')
                                }}
                                whileHover={{ scale: 1.05, background: '#d4af37', color: '#000' }}
                                style={{
                                    display: 'inline-block',
                                    border: '1px solid rgba(212,175,55,0.5)',
                                    padding: '16px 40px',
                                    color: '#d4af37',
                                    textDecoration: 'none',
                                    fontSize: '9px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3em',
                                    transition: 'all 0.4s ease',
                                    willChange: 'transform',
                                    cursor: 'pointer'
                                }}
                            >
                                View Collection
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}