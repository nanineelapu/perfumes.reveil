'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const reviews = [
    {
        name: "Arjun Mehta",
        location: "Mumbai, India",
        text: "The Oudh Noir is absolutely mesmerizing. It has this unique depth that I haven't found anywhere else.",
        initials: "AM",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"
    },
    {
        name: "Sanya Malhotra",
        location: "Delhi, India",
        text: "I was skeptical about ordering online, but the scent trail of Velvet Rose exceeded everything.",
        initials: "SM",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    },
    {
        name: "Rohan Varma",
        location: "Bangalore, India",
        text: "Exceptional longevity. I applied Saffron Silk in the morning and could still catch it by dinner.",
        initials: "RV",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    },
    {
        name: "Ananya Iyer",
        location: "Chennai, India",
        text: "Reveil has mastered the art of minimalism in design but absolute complexity in scent.",
        initials: "AI",
        image: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=200"
    },
    {
        name: "Vikram Singh",
        location: "Jaipur, India",
        text: "A truly international luxury experience right here in India. The packaging itself is a work of art.",
        initials: "VS",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
    }
]

export function ReviewsSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const x1 = useTransform(scrollYProgress, [0, 1], [0, -200])
    const x2 = useTransform(scrollYProgress, [0, 1], [-200, 0])

    return (
        <section
            ref={containerRef}
            className="reviews-section"
            style={{
                background: '#050505',
                padding: '160px 0',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Background Narrative Text */}
            <div style={{
                position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
                fontSize: '15vw', fontWeight: 900, color: 'rgba(255,255,255,0.02)',
                whiteSpace: 'nowrap', zIndex: 0, pointerEvents: 'none',
                fontFamily: 'var(--font-baskerville)', letterSpacing: '-0.05em'
            }}>
                DISTINGUISHED
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
                {/* Header with High-Fashion Layout */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '100px' }}>
                    <div style={{ display: 'flex', items: 'center', gap: '12px', opacity: 0.6, marginBottom: '24px' }}>
                        <div style={{ width: '30px', height: '1px', background: '#d4af37', marginTop: '8px' }} />
                        <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#d4af37' }}>Refined Feedback</span>
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(32px, 6vw, 64px)',
                        fontFamily: 'var(--font-baskerville)',
                        color: '#fff',
                        textTransform: 'uppercase',
                        lineHeight: 0.85,
                        margin: 0,
                        letterSpacing: '-0.02em'
                    }}>
                        Voices of <br />
                        <span style={{ color: '#d4af37' }}>The Archive</span>
                    </h2>
                </div>
            </div>

            {/* Kinetic Row 1 */}
            <motion.div style={{ display: 'flex', gap: '32px', x: x1, marginBottom: '32px', paddingLeft: '40px', willChange: 'transform' }}>
                {[...reviews, ...reviews].map((review, i) => (
                    <ReviewCard key={i} review={review} />
                ))}
            </motion.div>

            {/* Kinetic Row 2 */}
            <motion.div style={{ display: 'flex', gap: '32px', x: x2, paddingLeft: '200px', willChange: 'transform' }}>
                {[...reviews.reverse(), ...reviews].map((review, i) => (
                    <ReviewCard key={i} review={review} dark />
                ))}
            </motion.div>

            {/* Google Trust Banner */}
            <div style={{
                marginTop: '100px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#d4af37" color="#d4af37" />)}
                </div>
                <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                    Verified 4.9 Rating — Powered by Google
                </p>
            </div>
        </section>
    )
}

function ReviewCard({ review, dark = false }: { review: any, dark?: boolean }) {
    const [imgError, setImgError] = useState(false)
    const [randomId, setRandomId] = useState<number | null>(null)

    useEffect(() => {
        setRandomId(Math.floor(Math.random() * 900 + 100))
    }, [])
    const cardBg = dark ? '#000' : '#fff'
    const nameColor = '#d4af37' // Signature Gold
    const textColor = dark ? '#fff' : '#000'
    const borderColor = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
    const metaColor = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
                flexShrink: 0,
                width: '500px',
                background: cardBg,
                border: `1px solid ${borderColor}`,
                padding: '30px 40px',
                borderRadius: '60px 4px 60px 4px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '30px',
                boxShadow: dark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.05)'
            }}
        >
            {/* Left Column: Profile & Identity */}
            <div style={{
                width: '140px',
                textAlign: 'center',
                borderRight: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                paddingRight: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    overflow: 'hidden', marginBottom: '15px',
                    border: `1px solid ${nameColor}`,
                    background: '#111',
                    boxShadow: `0 0 10px ${nameColor}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {!imgError ? (
                        <img
                            src={review.image}
                            alt={review.name}
                            onError={() => setImgError(true)}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span style={{ fontSize: '12px', fontWeight: 900, color: nameColor }}>
                            {review.initials}
                        </span>
                    )}
                </div>

                <h4 style={{
                    fontSize: '12px',
                    fontWeight: 950,
                    color: nameColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.2,
                    marginBottom: '8px',
                    fontFamily: 'var(--font-baskerville)'
                }}>
                    {review.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '6px' }}>
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={8} fill={nameColor} color={nameColor} />
                    ))}
                </div>
                <div style={{
                    fontSize: '6px',
                    fontWeight: 900,
                    color: metaColor,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase'
                }}>
                    VERIFIED_GOOGLE
                </div>
            </div>

            {/* Right Column: Testimonial */}
            <div style={{ flex: 1, position: 'relative' }}>
                <p style={{
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: textColor,
                    fontFamily: 'var(--font-baskerville)',
                    margin: 0,
                    fontWeight: 500,
                    fontStyle: 'italic'
                }}>
                    "{review.text}"
                </p>

                <div style={{
                    position: 'absolute',
                    bottom: '-25px',
                    right: '-10px',
                    fontSize: '7px',
                    color: metaColor,
                    letterSpacing: '0.3em',
                    opacity: 0.6
                }}>
                    RPT — {review.initials}_{randomId || '...'}
                </div>
            </div>
        </motion.div>
    )
}
