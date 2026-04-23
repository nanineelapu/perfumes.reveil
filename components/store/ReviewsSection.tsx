'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const reviews = [
    {
        name: "Arjun Mehta",
        location: "Mumbai",
        text: "The Oudh Noir is absolutely mesmerizing. It has this unique depth that I haven't found anywhere else.",
        initials: "AM"
    },
    {
        name: "Sanya Malhotra",
        location: "Delhi",
        text: "I was skeptical about ordering online, but the scent trail of Velvet Rose exceeded everything.",
        initials: "SM"
    },
    {
        name: "Rohan Varma",
        location: "Bangalore",
        text: "Exceptional longevity. I applied Saffron Silk in the morning and could still catch it by dinner.",
        initials: "RV"
    },
    {
        name: "Ananya Iyer",
        location: "Chennai",
        text: "Reveil has mastered the art of minimalism in design but absolute complexity in scent.",
        initials: "AI"
    }
]

export function ReviewsSection() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <section
            style={{
                background: '#050505',
                padding: isMobile ? '60px 20px' : '100px 80px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '80px' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            fontSize: isMobile ? '20px' : 'clamp(32px, 5vw, 56px)',
                            fontFamily: 'var(--font-tenor)',
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            margin: 0,
                            color: '#fff',
                        }}
                    >
                        CLIENT <span style={{ color: '#d4af37', fontWeight: 300, fontStyle: 'italic' }}>REFLECTIONS</span>
                    </motion.h2>
                </div>

                {/* Grid - 2 Column for both Mobile and Desktop as per reference */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: isMobile ? '16px' : '40px',
                }}>
                    {reviews.map((review, i) => (
                        <ReviewCard key={i} review={review} index={i} isDark={i % 2 === 0} isMobile={isMobile} />
                    ))}
                </div>

                {/* Footer Stats - Matching Reference Layout */}
                <div style={{
                    marginTop: isMobile ? '40px' : '100px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: isMobile ? '12px' : '60px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: isMobile ? '30px' : '60px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '15px' }}>
                        <div style={{ fontSize: isMobile ? '24px' : '48px', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>4.7</div>
                        <div style={{ fontSize: '7px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textAlign: 'left', lineHeight: 1.4 }}>
                            GOOGLE <br /> SCORE <br /> AGGREGATE
                        </div>
                    </div>

                    <div style={{ width: '1px', height: isMobile ? '30px' : '40px', background: 'rgba(255,255,255,0.1)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '15px' }}>
                        <div style={{ fontSize: isMobile ? '24px' : '48px', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>2K+</div>
                        <div style={{ fontSize: '7px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textAlign: 'left', lineHeight: 1.4 }}>
                            MONTHLY <br /> ACTIVE <br /> VISITORS
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function ReviewCard({ review, index, isDark, isMobile }: { review: any, index: number, isDark: boolean, isMobile: boolean }) {
    const [randomId] = useState(Math.floor(Math.random() * 900 + 100))
    const accentColor = '#d4af37' // Luxury gold accent

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            style={{
                background: isDark ? '#080808' : '#fcfcfc',
                padding: isMobile ? '12px 16px' : '16px 40px',
                borderRadius: isMobile ? '30px 4px 30px 4px' : '60px 4px 60px 4px',
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '12px' : '10px',
                position: 'relative',
                boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)',
                border: '1px solid rgba(255,255,255,0.03)'
            }}
        >
            {/* Header Area */}
            <div>
                <h3 style={{
                    fontSize: isMobile ? '10px' : '16px',
                    fontWeight: 900,
                    color: accentColor,
                    textTransform: 'uppercase',
                    margin: '0 0 8px',
                    letterSpacing: '0.05em'
                }}>
                    {review.name}
                </h3>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={isMobile ? 8 : 12} fill={accentColor} color={accentColor} />
                    ))}
                </div>
                <div style={{
                    fontSize: '7px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    textTransform: 'uppercase'
                }}>
                    VERIFIED_GOOGLE
                </div>
            </div>

            {/* Separator */}
            <div style={{ height: '1px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', width: '100%' }} />

            {/* Review Content */}
            <div style={{ flex: 1 }}>
                <p style={{
                    fontSize: isMobile ? '10px' : '15px',
                    lineHeight: 1.5,
                    color: isDark ? '#fff' : '#1a1a1a',
                    fontFamily: 'var(--font-tenor)',
                    fontWeight: 300,
                    margin: 0,
                }}>
                    "{review.text}"
                </p>
            </div>

            {/* Batch ID Footer */}
            <div style={{
                textAlign: 'right',
                fontSize: '8px',
                color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                letterSpacing: '0.2em',
                fontFamily: 'monospace'
            }}>
                RPT — {review.initials}_{randomId}
            </div>
        </motion.div>
    )
}
