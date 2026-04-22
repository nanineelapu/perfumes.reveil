'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

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
    },
    {
        name: "Vikram Singh",
        location: "Jaipur",
        text: "A truly international luxury experience right here in India. The packaging itself is a work of art.",
        initials: "VS",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
    },
    {
        name: "Meera Kapoor",
        location: "Hyderabad",
        text: "The presentation is impeccable. It feels like unboxing a piece of high fashion rather than just a perfume.",
        initials: "MK",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
    }
]

export function ReviewsSection() {
    return (
        <section
            style={{
                background: '#050505',
                padding: '120px 80px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ maxWidth: '100vw', margin: '0 auto', padding: '0 0 0 80px', position: 'relative' }}>
                
                {/* Minimalist Header */}
                <div style={{ marginBottom: '60px', textAlign: 'left' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <span style={{ 
                            fontSize: '9px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.8em', 
                            color: '#d4af37',
                            marginBottom: '16px',
                            display: 'block'
                        }}>
                            Archive Reflections
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(32px, 4vw, 42px)',
                            fontFamily: 'var(--font-baskerville)',
                            color: '#fff',
                            fontWeight: 400,
                            margin: 0,
                            letterSpacing: '-0.01em'
                        }}>
                            Refined <span style={{ fontStyle: 'italic', color: '#d4af37' }}>Voices</span>
                        </h2>
                    </motion.div>
                </div>

                {/* Draggable Carousel Container */}
                <motion.div 
                    style={{
                        display: 'flex',
                        gap: '24px',
                        cursor: 'grab',
                        paddingBottom: '40px',
                        overflowX: 'auto',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        paddingRight: '80px'
                    }}
                    whileTap={{ cursor: 'grabbing' }}
                >
                    {reviews.map((review, i) => (
                        <ReviewCard key={i} review={review} index={i} />
                    ))}
                </motion.div>

                {/* Google Meta Info - Offset */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.3 }}
                    viewport={{ once: true }}
                    style={{
                        marginTop: '40px',
                        paddingRight: '80px',
                        fontSize: '8px',
                        letterSpacing: '0.5em',
                        textTransform: 'uppercase',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '20px'
                    }}
                >
                    <div style={{ width: '40px', height: '1px', background: '#fff' }} />
                    VERIFIED 4.9 RATING — ARCHIVAL FEEDBACK
                </motion.div>
            </div>
        </section>
    )
}

function ReviewCard({ review, index }: { review: any, index: number }) {
    return (
        <motion.div
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true }}
            variants={{
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0, transition: { duration: 0.8, delay: index * 0.1 } },
                hover: { 
                    backgroundColor: '#d4af37',
                    borderColor: '#d4af37',
                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                }
            }}
            style={{
                flexShrink: 0,
                width: '340px',
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.04)',
                padding: '40px',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '420px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.4s'
            }}
        >
            <div>
                <motion.div 
                    variants={{
                        hover: { color: '#000', scale: 1.1 }
                    }}
                    style={{ display: 'flex', gap: '4px', marginBottom: '32px', color: '#d4af37' }}
                >
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" color="currentColor" strokeWidth={3} />
                    ))}
                </motion.div>
                
                <motion.p 
                    variants={{
                        hover: { color: '#000', x: 5 }
                    }}
                    style={{
                        fontSize: '16px',
                        lineHeight: 1.7,
                        color: '#bbb',
                        fontFamily: 'var(--font-tenor)',
                        fontWeight: 300,
                        margin: '0 0 40px',
                        fontStyle: 'italic',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                >
                    "{review.text}"
                </motion.p>
            </div>

            <motion.div 
                variants={{
                    hover: { borderTopColor: 'rgba(0,0,0,0.1)', y: -5 }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '32px', transition: 'all 0.4s' }}
            >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <img src={review.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={review.name} />
                </div>
                <div>
                    <motion.div 
                        variants={{
                            hover: { color: '#000' }
                        }}
                        style={{ 
                            fontSize: '10px', 
                            color: '#fff', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.2em', 
                            fontWeight: 700,
                            marginBottom: '2px',
                            transition: 'color 0.4s'
                        }}>
                        {review.name}
                    </motion.div>
                    <motion.div 
                        variants={{
                            hover: { color: 'rgba(0,0,0,0.4)' }
                        }}
                        style={{ fontSize: '8px', color: '#555', letterSpacing: '0.1em', transition: 'color 0.4s' }}>
                        {review.location}
                    </motion.div>
                </div>
            </motion.div>

            {/* Spotlight Effect Overlay */}
            <motion.div
                variants={{
                    hover: { opacity: 0.15, scale: 2 }
                }}
                initial={{ opacity: 0, scale: 1 }}
                style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle at center, #fff 0%, transparent 60%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />
        </motion.div>
    )
}
