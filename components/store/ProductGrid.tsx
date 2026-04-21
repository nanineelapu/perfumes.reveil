'use client'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { Product, Collection } from '@/types/store'
import { AnimatedPageSection } from './AnimatedPageSection'


export default function ProductGrid({ items }: { items: (Product | Collection)[] }) {
    if (!items || items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '120px', color: '#666', background: '#050505' }}>
                <div style={{ fontSize: '12px', letterSpacing: '0.4em', textTransform: 'uppercase' }}>No curation found at this moment.</div>
            </div>
        )
    }

    return (
        <AnimatedPageSection delay={0.1} style={{ background: '#050505', padding: '160px 0', position: 'relative', overflow: 'hidden' }}>
            {/* Architectural Border Accents */}
            <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)' }} />

            {/* Side Branding */}
            <div style={{
                position: 'absolute', left: '40px', top: '160px',
                writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                fontSize: '9px', letterSpacing: '1.2em', color: '#d4af37',
                textTransform: 'uppercase', opacity: 0.3, fontWeight: 300,
                fontFamily: 'var(--font-baskerville)'
            }}>
                P R E M I E R — T R E N D S
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', position: 'relative' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '80px',
                    gap: '30px'
                }}>
                    <div style={{ display: 'flex', gap: '30px' }}>
                        {/* Vertical Meta Branding */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '25px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{
                                writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                                fontSize: '10px', fontWeight: 900, color: '#d4af37',
                                letterSpacing: '0.4em', textTransform: 'uppercase',
                            }}>
                                EST. 2024
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.6, marginBottom: '24px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.6em', textTransform: 'uppercase', color: '#fff' }}>CURATED SELECTION</span>
                            </div>
                            <h2 style={{
                                fontSize: 'clamp(24px, 4vw, 42px)',
                                fontFamily: 'var(--font-baskerville)',
                                color: '#fff', margin: 0, lineHeight: 1,
                                letterSpacing: '0.02em', textTransform: 'uppercase'
                            }}>
                                TRENDING <span style={{ color: '#d4af37' }}>CURATION</span>
                            </h2>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ maxWidth: '400px' }}
                    >
                        <p style={{
                            fontSize: '15px', color: '#777', fontWeight: 300,
                            lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-baskerville)',
                            textAlign: 'right', letterSpacing: '0.02em', fontStyle: 'italic'
                        }}>
                            Discover the scents defining the modern luxury landscape.
                        </p>
                    </motion.div>
                </div>

                {/* Grid with Tighter Scaling */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '50px 30px',
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