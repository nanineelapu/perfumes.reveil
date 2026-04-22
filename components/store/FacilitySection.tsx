'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function FacilitySection() {
    const items = [
        {
            badge: 'OUR WORKSHOP',
            title: 'How We Make It',
            description: 'We use high-quality natural ingredients to make every perfume. Our process ensures that you get the best and longest-lasting scent for your daily use.',
            image: 'https://images.unsplash.com/photo-1615485290382-441e4d019cb0?auto=format&fit=crop&q=80&w=1200',
            link: '/about',
            reverse: false
        },
        {
            badge: 'FOR YOU',
            title: 'Personal Scent Design',
            description: 'Work with our experts to create a perfume that is made just for you. We help you find the right blend of scents that matches your style.',
            image: 'https://images.unsplash.com/photo-1595425959632-34f282232371?auto=format&fit=crop&q=80&w=1200',
            link: '/contact',
            reverse: true
        }
    ]

    return (
        <section style={{
            padding: '80px 60px',
            background: '#050505',
            color: '#fff',
            position: 'relative'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        style={{
                            fontSize: 'clamp(28px, 4vw, 42px)',
                            fontFamily: 'var(--font-baskerville)',
                            lineHeight: 1.2,
                            fontWeight: 400,
                            margin: 0
                        }}
                    >
                        We offer <span style={{ color: '#d4af37' }}>Quality Service</span> <br />
                        for <span style={{ fontStyle: 'italic' }}>Everyone</span>
                    </motion.h2>
                </div>

                {/* Content Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '80px',
                                alignItems: 'center',
                                direction: item.reverse ? 'rtl' : 'ltr'
                            }}
                        >
                            {/* Image Container */}
                            <motion.div
                                initial={{ opacity: 0, x: item.reverse ? 40 : -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    height: '380px',
                                    borderRadius: '32px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                                    direction: 'ltr' // Reset direction for inner image
                                }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' }} />
                            </motion.div>

                            {/* Content Container */}
                            <motion.div
                                initial={{ opacity: 0, x: item.reverse ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                style={{ direction: 'ltr', textAlign: 'left' }}
                            >
                                <div style={{
                                    display: 'inline-block',
                                    padding: '6px 16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '100px',
                                    fontSize: '8px',
                                    letterSpacing: '0.15em',
                                    color: '#888',
                                    marginBottom: '24px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    {item.badge}
                                </div>

                                <h3 style={{
                                    fontSize: 'clamp(24px, 3vw, 36px)',
                                    fontFamily: 'var(--font-baskerville)',
                                    marginBottom: '20px',
                                    fontWeight: 400,
                                    lineHeight: 1.2
                                }}>
                                    {item.title}
                                </h3>

                                <p style={{
                                    fontSize: '14px',
                                    lineHeight: 1.7,
                                    color: '#888',
                                    marginBottom: '40px',
                                    maxWidth: '450px',
                                    fontWeight: 300,
                                    fontFamily: 'var(--font-tenor)'
                                }}>
                                    {item.description}
                                </p>

                                <Link href={item.link} style={{ textDecoration: 'none' }}>
                                    <motion.button
                                        whileHover={{ backgroundColor: '#fff', color: '#000', scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            padding: '14px 32px',
                                            background: '#d4af37',
                                            border: 'none',
                                            borderRadius: '100px',
                                            color: '#000',
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            letterSpacing: '0.1em',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            transition: 'all 0.4s'
                                        }}
                                    >
                                        READ MORE <ArrowUpRight size={16} />
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
