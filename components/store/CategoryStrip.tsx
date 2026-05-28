'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

type Category = { id: string; name: string; slug: string; image_url?: string | null }

export default function CategoryStrip({ categories }: { categories: Category[] }) {
    if (!categories || categories.length === 0) return null

    return (
        <section style={{
            background: '#f8f7f2',
            padding: 'clamp(48px, 7vw, 88px) 0 clamp(40px, 6vw, 72px)',
            position: 'relative',
            borderTop: '1px solid rgba(212,175,55,0.18)'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 60px)' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '16px', marginBottom: 'clamp(28px, 4vw, 48px)'
                }}>
                    <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.4)' }} />
                    <span style={{
                        fontSize: '11px', letterSpacing: '0.4em',
                        color: '#d4af37', textTransform: 'uppercase', fontWeight: 500
                    }}>
                        Shop by Category
                    </span>
                    <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.4)' }} />
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: 'clamp(12px, 1.6vw, 20px)',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <CategoryCard href="/products" label="All Fragrances" hint="View entire archive" />
                    {categories.map((cat) => (
                        <CategoryCard
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            label={cat.name}
                            image={cat.image_url || undefined}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

function CategoryCard({ href, label, hint, image }: { href: string; label: string; hint?: string; image?: string }) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    background: 'linear-gradient(180deg, #ffffff 0%, #faf6ec 100%)',
                    border: '1px solid rgba(212,175,55,0.22)',
                    borderRadius: '18px',
                    padding: '22px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 18px rgba(26,26,26,0.04)',
                    transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
                    cursor: 'pointer',
                    minHeight: '140px',
                    justifyContent: 'center'
                }}
            >
                <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: image
                        ? `center/cover url(${image})`
                        : 'radial-gradient(circle at 30% 30%, #f2dca8 0%, #d4af37 90%)',
                    border: '1px solid rgba(212,175,55,0.35)',
                    boxShadow: 'inset 0 0 0 4px rgba(255,255,255,0.55)'
                }} />
                <div style={{
                    fontSize: '13px', fontWeight: 600, color: '#1a1a1a',
                    fontFamily: 'var(--font-baskerville)', letterSpacing: '0.02em',
                    lineHeight: 1.2
                }}>
                    {label}
                </div>
                {hint && (
                    <div style={{
                        fontSize: '9px', color: '#d4af37',
                        letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500
                    }}>
                        {hint}
                    </div>
                )}
            </motion.div>
        </Link>
    )
}
