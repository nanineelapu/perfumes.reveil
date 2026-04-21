'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
import { AnimatedPageSection } from './AnimatedPageSection'
import { Collection } from '@/types/store'


export function PhilosophySection() {
    return (
        <AnimatedPageSection delay={0.2} style={{
            padding: '40px 80px',
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
                    fontSize: '15vw', fontWeight: 900, color: 'rgba(0,0,0,0.02)',
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
                    position: 'absolute', right: '60px', top: '50%', transform: 'translateY(-50%)',
                    writingMode: 'vertical-rl',
                    textTransform: 'uppercase',
                    letterSpacing: '1em',
                    fontSize: '9px',
                    fontWeight: 600,
                    color: '#d4af37',
                    fontFamily: 'var(--font-baskerville)',
                    zIndex: 2
                }}>
                Reveil / Philosophy — Artisan Series
            </motion.div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: '800px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        style={{
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.8em',
                            marginBottom: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: '#d4af37'
                        }}
                    >
                        The Creative Process <span style={{ width: '40px', height: '1px', background: '#d4af37' }} />
                    </motion.div>

                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 52px)',
                        fontFamily: 'var(--font-baskerville)',
                        lineHeight: 1.25,
                        fontWeight: 400,
                        letterSpacing: '-0.01em',
                        margin: 0,
                        color: '#1a1a1a',
                        maxWidth: '760px'
                    }}>
                        {"Elevated perfumes crafted with natural extraits and made with artisanal care. Timeless and sensory experiences.".split(' ').map((word, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 1.2,
                                    delay: i * 0.05,
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
                        style={{ marginTop: '64px' }}
                    >
                        <Link href="/about" style={{
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4em',
                            color: '#1a1a1a',
                            textDecoration: 'none',
                            borderBottom: '1px solid #d4af37',
                            paddingBottom: '8px'
                        }}>
                            OUR STORY
                        </Link>
                    </motion.div>
                </div>
            </div>
        </AnimatedPageSection>
    )
}


export function NotesSection() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const [collections, setCollections] = useState<Collection[]>([])

    useEffect(() => {
        fetch('/api/collections')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCollections(data)
                } else {
                    console.error('Expected array of collections, got:', data)
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
            padding: '80px 80px',
            background: '#0a0a0a',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>

                {/* Unique Offset Header */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '40px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{
                            fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.6em',
                            color: '#d4af37', writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                            fontFamily: 'var(--font-baskerville)', paddingRight: '20px', borderRight: '1px solid rgba(212,175,55,0.3)'
                        }}
                    >
                        EST. 2026
                    </motion.div>

                    <div style={{ flex: 1 }}>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.5 }}
                            viewport={{ once: true }}
                            style={{
                                fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1em',
                                color: '#fff', display: 'block', marginBottom: '12px'
                            }}
                        >
                            Curated Series
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{
                                fontSize: 'clamp(24px, 4vw, 48px)',
                                fontFamily: 'var(--font-baskerville)',
                                color: '#fff', margin: 0, letterSpacing: '-0.02em',
                                lineHeight: 1
                            }}
                        >
                            THE <span style={{ color: '#d4af37' }}>COLLECTIONS</span>
                        </motion.h2>
                    </div>

                    <div style={{ maxWidth: '350px', position: 'absolute', right: 0, bottom: 0, textAlign: 'right' }}>
                        <p style={{
                            fontSize: '14px', color: '#666', fontWeight: 300,
                            lineHeight: 1.6, margin: 0, fontStyle: 'italic',
                            fontFamily: 'var(--font-baskerville)'
                        }}>
                            Meticulously crafted universes. Distinct olfactory journeys.
                        </p>
                    </div>
                </div>

                {/* Single Row Compact Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px'
                }}>
                    {Array.isArray(collections) && collections.map((item, i) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            style={{
                                position: 'relative',
                                height: '380px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                borderRadius: '2px'
                            }}
                        >
                            <Link href="/products" style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
                                <motion.div
                                    whileHover="hover"
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
                                            filter: 'brightness(0.8)'
                                        }}
                                    />

                                    {/* Compact Hover Reveal */}
                                    <motion.div
                                        variants={{
                                            hover: { opacity: 1 }
                                        }}
                                        initial={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{
                                            position: 'absolute', inset: 0,
                                            background: 'rgba(0,0,0,0.7)',
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

                                    {/* Label Area */}
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        padding: '24px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)'
                                    }}>
                                        <div style={{
                                            fontSize: '8px', color: '#d4af37',
                                            letterSpacing: '0.3em', marginBottom: '6px',
                                            fontFamily: 'var(--font-baskerville)',
                                            textTransform: 'uppercase'
                                        }}>
                                            {item.type}
                                        </div>
                                        <div style={{
                                            fontSize: '16px', color: '#fff',
                                            fontWeight: 800, fontFamily: 'var(--font-baskerville)',
                                        }}>
                                            {item.name}
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/**
 * Brand Showcase: The Premier Showroom
 */
export function BrandShowcaseSection() {
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
            padding: '60px 80px',
            background: '#050505',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* Minimalist Heading */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <span style={{
                            fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1.2em',
                            color: '#d4af37', display: 'block', marginBottom: '16px',
                            fontFamily: 'var(--font-baskerville)'
                        }}>
                            Exquisite Curation
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(24px, 4vw, 36px)',
                            fontFamily: 'var(--font-baskerville)',
                            color: '#fff', margin: 0, letterSpacing: '0.1em',
                            textTransform: 'uppercase'
                        }}>
                            THE PREMIER <span style={{ color: '#d4af37' }}>CURATION</span>
                        </h2>
                    </motion.div>
                </div>

                {/* Single Row Horizontal Strip - 6 Distinct Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: '16px'
                }}>
                    {brands.map((brand, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            style={{
                                position: 'relative',
                                height: '180px',
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
                                                width: '80%',
                                                height: '80%',
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

                                    {/* Subtle Label (Reveals on Hover) */}
                                    <motion.div
                                        variants={{ hover: { opacity: 1, y: -10 } }}
                                        initial={{ opacity: 0, y: 0 }}
                                        style={{
                                            position: 'absolute', bottom: '12px',
                                            fontSize: '8px', color: '#fff',
                                            fontFamily: 'var(--font-baskerville)',
                                            letterSpacing: '0.15em',
                                            textAlign: 'center', width: '100%',
                                            zIndex: 2
                                        }}
                                    >
                                        {brand.name}
                                    </motion.div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/**
 * Reveil Collection: Restored Noir Red Visuals
 */
export function ReveilCollectionSection() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    // Cinematic Parallax Transforms
    // Cinematic Parallax Transforms - Snappier ranges for better sync
    const imageScale = useTransform(scrollYProgress, [0, 0.8], [1.05, 1.2])
    const titleY = useTransform(scrollYProgress, [0, 0.8], [30, -30])
    const labelX = useTransform(scrollYProgress, [0, 0.8], [-20, 20])

    return (
        <section ref={containerRef} style={{
            background: '#050505',
            padding: '100px 80px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* The Floating Rounded Card Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    minHeight: '85vh',
                    position: 'relative',
                    borderRadius: '48px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 80px 160px rgba(0,0,0,1)',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                {/* Visual Anchor: Noir & Red Atmospheric Visual */}
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
                    {/* Refined Lighting Overlay (Not pure black) */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.9) 100%)'
                    }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
                    }} />
                </motion.div>

                <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 60px', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '80px', alignItems: 'center' }}>

                        {/* Dramatic Editorial Titles */}
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

                            {/* Drifting Ghost Label */}
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

                        {/* Compact Narrative Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2 }}
                            style={{
                                padding: '48px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(50px)',
                                borderRadius: '4px',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                justifySelf: 'end'
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

                            <motion.a
                                href="/products"
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
                                    willChange: 'transform'
                                }}
                            >
                                View Collection
                            </motion.a>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}