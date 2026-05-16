'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { AnimatedNavbar } from '@/components/store/AnimatedNavbar'
import { StayConnected } from '@/components/store/StayConnected'

export default function AboutPage() {
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const gold = '#d4af37'
    const black = '#111111'
    const gray = '#f4f4f4'
    const textGray = '#666666'

    return (
        <main style={{ background: '#ffffff', color: black, minHeight: '100vh', overflowX: 'hidden' }}>
            {/* HIDDEN SEO HEADINGS - GOD LEVEL SEO */}
            <div className="sr-only">
                <h1>REVEIL Fragrances - Premium Luxury Fragrances and Authentic Attars in India</h1>
                <h2>Best Long Lasting Perfumes for Men and Women - Designer Scents Archive</h2>
                <p>Explore the art of perfumery with REVEIL Fragrances. Our signature laboratory fragrances are crafted for longevity, sophistication, and elegance. Buy luxury perfumes, Oudh, Musk, and Floral scents online.</p>
                <h3>Top Rated Designer Fragrances India - REVEIL Laboratory</h3>
            </div>

            <AnimatedNavbar />
            
            {/* Editorial Hero Section */}
            <section style={{
                padding: isMobile ? '160px 24px 80px' : '220px 40px 120px',
                background: '#ffffff',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 0.03, scale: 1 }}
                    transition={{ duration: 2 }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: isMobile ? '80px' : '280px',
                        fontWeight: 900,
                        whiteSpace: 'nowrap',
                        zIndex: 0,
                        pointerEvents: 'none',
                        fontFamily: 'var(--font-baskerville)'
                    }}
                >
                    EST. 2024
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ zIndex: 1 }}
                >
                    <span style={{
                        fontSize: '12px',
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        color: gold,
                        fontWeight: 600,
                        display: 'block',
                        marginBottom: '20px'
                    }}>
                        Discover Our World
                    </span>
                    <h1 style={{
                        fontSize: isMobile ? '42px' : 'clamp(40px, 7vw, 90px)',
                        fontFamily: 'var(--font-baskerville)',
                        fontWeight: 400,
                        lineHeight: 1.1,
                        margin: '0 auto 32px',
                        maxWidth: '900px'
                    }}>
                        We believe a scent tells <br />
                        <span style={{ fontStyle: 'italic', color: gold }}>your unique story.</span>
                    </h1>
                    <div style={{ width: '60px', height: '1px', background: black, margin: '0 auto' }} />
                </motion.div>
            </section>

            {/* Evolution Section */}
            <section style={{ padding: isMobile ? '60px 24px' : '100px 80px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row-reverse',
                    gap: isMobile ? '60px' : '100px',
                    alignItems: 'center'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{ flex: 1 }}
                    >
                        <h2 style={{
                            fontSize: isMobile ? '28px' : '42px',
                            fontFamily: 'var(--font-baskerville)',
                            marginBottom: '40px'
                        }}>
                            Going Digital
                        </h2>
                        <div style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: 1.8, color: textGray }}>
                            <p style={{ marginBottom: '24px' }}>
                                In 2023, we took a big step. We launched <strong>reveilfragrances.in</strong> to reach more people across the country.
                            </p>
                            <p>
                                Today, we bring you the best brands like Denver, Wild Stone, and Secret Temptation. We choose each item carefully to make sure you get only the best quality.
                            </p>
                        </div>
                    </motion.div>

                    <div style={{ flex: 1.2, position: 'relative', width: '100%' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px'
                        }}>
                            <motion.img
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                src="https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/1.jpg"
                                alt="Reveil perfume bottle"
                                style={{ width: '100%', height: isMobile ? '200px' : '350px', objectFit: 'cover', borderRadius: '12px' }}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                style={{ background: black, padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}
                            >
                                <h4 style={{ fontSize: '18px', fontFamily: 'var(--font-baskerville)', marginBottom: '12px', color: gold }}>Modern Choice</h4>
                                <p style={{ fontSize: '12px', opacity: 0.7, lineHeight: 1.6 }}>Bringing luxury scents to your doorstep with just a click.</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values / Why Us */}
            <section style={{ padding: isMobile ? '80px 24px' : '120px 80px', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: isMobile ? '32px' : '48px', fontFamily: 'var(--font-baskerville)', marginBottom: '16px' }}>Why Choose Us</h2>
                        <div style={{ width: '40px', height: '2px', background: gold, margin: '0 auto' }} />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                        gap: '40px'
                    }}>
                        {[
                            { title: 'Quality First', desc: 'We only sell original and high-quality perfumes that last long.' },
                            { title: 'Trusted Legacy', desc: 'Over 25 years of experience in the fragrance industry.' },
                            { title: 'Fast Delivery', desc: 'We make sure your favorite scent reaches you as fast as possible.' }
                        ].map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    padding: '40px',
                                    border: `1px solid ${gray}`,
                                    textAlign: 'center',
                                    transition: 'border-color 0.3s'
                                }}
                            >
                                <h4 style={{ fontSize: '20px', fontFamily: 'var(--font-baskerville)', marginBottom: '16px' }}>{v.title}</h4>
                                <p style={{ fontSize: '14px', color: textGray, lineHeight: 1.6 }}>{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <StayConnected theme="light" />
        </main>
    )
}
