'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const reviews = [
    {
        name: "Arjun Mehta",
        location: "Mumbai",
        text: "The Oudh Noir is absolutely mesmerizing. It has this unique depth that I haven't found anywhere else.",
        initials: "AM",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"
    },
    {
        name: "Sanya Malhotra",
        location: "Delhi",
        text: "I was skeptical about ordering online, but the scent trail of Velvet Rose exceeded everything.",
        initials: "SM",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    },
    {
        name: "Rohan Varma",
        location: "Bangalore",
        text: "Exceptional longevity. I applied Saffron Silk in the morning and could still catch it by dinner.",
        initials: "RV",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    },
    {
        name: "Ananya Iyer",
        location: "Chennai",
        text: "Reveil has mastered the art of minimalism in design but absolute complexity in scent.",
        initials: "AI",
        image: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=200"
    }
]

export function ReviewsSection() {
    return (
        <section
            style={{
                background: '#050505', // Noir background
                padding: '80px 80px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* Header: Customer Insights Style */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            fontSize: 'clamp(28px, 4vw, 48px)',
                            fontFamily: 'var(--font-tenor)',
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            margin: 0,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '15px'
                        }}
                    >
                        CLIENT <span style={{ color: '#d4af37', fontWeight: 300, fontStyle: 'italic' }}>REFLECTIONS</span>
                    </motion.h2>
                </div>

                {/* 2-Column Grid of Asymmetric Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '40px'
                }}>
                    {reviews.map((review, i) => (
                        <ReviewCard key={i} review={review} index={i} isDark={i % 2 === 0} />
                    ))}
                </div>

                {/* Footer Stats */}
                <div style={{
                    marginTop: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '120px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '40px'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>4.7</div>
                        <div style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Google Score Aggregate</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>10K+</div>
                        <div style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Active Monthly Logged Data</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function ReviewCard({ review, index, isDark }: { review: any, index: number, isDark: boolean }) {
    const [randomId] = useState(Math.floor(Math.random() * 900 + 100))

    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover="hover"
            viewport={{ once: true }}
            variants={{
                hover: {
                    backgroundColor: '#d4af37',
                    scale: 1.02,
                    transition: { duration: 0.4, ease: "easeOut" }
                }
            }}
            style={{
                background: isDark ? '#111111' : '#fff', // Use specific #111111 for dark cards
                border: '1px solid rgba(255,255,255,0.05)',
                padding: '30px 40px',
                borderRadius: '60px 4px 60px 4px', // Slightly smaller asymmetric pill
                display: 'flex',
                alignItems: 'center',
                gap: '30px',
                minHeight: '180px',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                transition: 'background-color 0.4s, color 0.4s'
            }}
        >
            {/* Left: Identity */}
            <div style={{
                width: '180px',
                flexShrink: 0,
                borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                paddingRight: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <motion.div
                    variants={{ hover: { color: '#000' } }}
                    style={{
                        fontSize: '14px',
                        fontWeight: 900,
                        color: isDark ? '#fff' : '#d4af37',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '10px',
                        lineHeight: 1.2
                    }}>
                    {review.name}
                </motion.div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                    {[...Array(5)].map((_, i) => (
                        <motion.div key={i} variants={{ hover: { color: '#000' } }}>
                            <Star size={10} fill={isDark ? '#d4af37' : '#d4af37'} color="currentColor" strokeWidth={3} />
                        </motion.div>
                    ))}
                </div>
                <div style={{
                    fontSize: '7px',
                    fontWeight: 800,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'
                }}>
                    VERIFIED_GOOGLE
                </div>
            </div>

            {/* Right: Review Text */}
            <div style={{ flex: 1, position: 'relative' }}>
                <motion.p
                    variants={{ hover: { color: '#000' } }}
                    style={{
                        fontSize: '15px',
                        lineHeight: 1.6,
                        color: isDark ? '#fff' : '#000',
                        fontFamily: 'var(--font-tenor)',
                        fontWeight: 300,
                        margin: 0,
                        fontStyle: 'italic'
                    }}
                >
                    "{review.text}"
                </motion.p>
                <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    right: 0,
                    fontSize: '8px',
                    color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    letterSpacing: '0.2em'
                }}>
                    RPT — {review.initials}_{randomId}
                </div>
            </div>
        </motion.div>
    )
}
