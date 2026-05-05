'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { Product, Collection } from '@/types/store'
import { AnimatedPageSection } from './AnimatedPageSection'


export default function ProductGrid({ items }: { items: (Product | Collection)[] }) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    if (!items || items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '120px', color: '#666', background: '#050505' }}>
                <div style={{ fontSize: '12px', letterSpacing: '0.4em', textTransform: 'uppercase' }}>No curation found at this moment.</div>
            </div>
        )
    }

    return (
        <AnimatedPageSection delay={0.1} style={{ background: '#050505', padding: isMobile ? '60px 20px' : '100px 80px', position: 'relative', overflow: 'hidden' }}>
            {/* Architectural Border Accents */}
            <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)' }} />

            <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'center' : 'baseline',
                    marginBottom: isMobile ? '40px' : '80px',
                    gap: isMobile ? '20px' : '30px',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    <div style={{ display: 'flex', gap: isMobile ? '16px' : '30px', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'flex-start' }}>
                        {/* Vertical Meta Branding removed */}

                        <motion.div
                            initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}
                        >
                            {isMobile && (
                                <div style={{
                                    fontSize: '8px', fontWeight: 900, color: '#d4af37',
                                    letterSpacing: '0.4em', textTransform: 'uppercase',
                                    marginBottom: '16px'
                                }}>
                                    EST. 2024
                                </div>
                            )}

                            <h2 style={{
                                fontSize: isMobile ? '20px' : 'clamp(24px, 4vw, 42px)',
                                fontFamily: 'var(--font-baskerville)',
                                color: '#fff', margin: 0, lineHeight: 1,
                                letterSpacing: '0.02em', textTransform: 'uppercase',
                                whiteSpace: isMobile ? 'nowrap' : 'normal'
                            }}>
                                TRENDING <span style={{ color: '#d4af37' }}>CURATION</span>
                            </h2>

                            {isMobile && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.6, marginTop: '12px' }}>
                                    <span style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.6em', textTransform: 'uppercase', color: '#fff' }}># CURATED SELECTION</span>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {!isMobile && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            style={{ opacity: 0.6 }}
                        >
                            <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.6em', textTransform: 'uppercase', color: '#fff' }}># CURATED SELECTION</span>
                        </motion.div>
                    )}




                </div>

                {/* Grid with Tighter Scaling */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: isMobile ? '24px 12px' : '50px 30px',
                    alignItems: 'stretch',
                }}>
                    {items.map((item, i) => {
                        const product: Product = 'image_url' in item ? {
                            id: item.id,
                            name: item.name,
                            slug: item.name.toLowerCase().replace(/ /g, '-'),
                            price: item.price ?? 0,
                            images: [item.image_url],
                            category: item.type,
                            rating: 5,
                            stock: 1
                        } : item;

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.8,
                                    delay: i * 0.08,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                            style={{ height: '100%' }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        )
                    })}

                </div>
            </div>
        </AnimatedPageSection>
    )
}