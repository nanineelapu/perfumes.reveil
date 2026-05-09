'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, User } from 'lucide-react'

interface Review {
    id: string
    rating: number
    comment: string
    created_at: string
    reviewer_name?: string
    reviewer_avatar?: string
    profiles: {
        full_name: string
        avatar_url?: string
    } | { full_name: string, avatar_url?: string }[]
}

export function ReviewsSection({ reviews = [] }: { reviews?: Review[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (reviews.length <= 1) return
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [reviews.length])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        })
    }

    if (reviews.length === 0) return (
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
            <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed rgba(212,175,55,0.1)', borderRadius: '2px' }}>
                <p style={{ color: '#444', fontSize: '14px', fontStyle: 'italic', fontFamily: 'var(--font-baskerville)' }}>No reviews have been archived for this fragment yet.</p>
            </div>
        </section>
    )

    const currentReview = reviews[currentIndex]
    const profile = Array.isArray(currentReview.profiles) ? currentReview.profiles[0] : currentReview.profiles
    const name = currentReview.reviewer_name || profile?.full_name || 'Anonymous Collector'
    const avatar = currentReview.reviewer_avatar || profile?.avatar_url
    const isEven = currentIndex % 2 === 0

    return (
        <section style={{ width: '100%', padding: '0', background: '#000', overflow: 'hidden' }}>
            <header style={{ marginBottom: '20px', marginTop: '0', textAlign: 'center', position: 'relative' }}>
                <div style={{
                    width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #d4af37)',
                    margin: '0 auto 24px', opacity: 0.5
                }} />
                <p style={{
                    fontSize: '11px', color: '#d4af37', letterSpacing: '0.4em',
                    textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700,
                    fontFamily: 'var(--font-montserrat)'
                }}>Verified Feedback</p>
                <h2 style={{
                    fontSize: 'clamp(32px, 5vw, 48px)',
                    fontFamily: 'var(--font-baskerville)',
                    color: '#fff',
                    margin: 0,
                    fontWeight: 400,
                    letterSpacing: '-0.02em'
                }}>
                    Customer <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Insights_</span>
                </h2>
            </header>

            <div className="carousel-section">
                <div className="carousel-container">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentReview.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 0.6,
                                ease: "easeInOut"
                            }}
                            style={{
                                position: 'relative',
                                width: '100%',
                                willChange: 'opacity',
                                transform: 'translateZ(0)',
                            }}
                            className="review-card desktop-carousel-card"
                        >
                            <div className="review-left">
                                <div className="avatar-container">
                                    {avatar ? (
                                        <img src={avatar} alt={name} className="reviewer-avatar" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            <User size={16} />
                                        </div>
                                    )}
                                </div>
                                <h4 className="reviewer-name">{name}</h4>
                                <div style={{ display: 'flex', gap: '2px', marginBottom: '8px', justifyContent: 'center' }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            size={10}
                                            fill={currentReview.rating >= s ? '#d4af37' : 'transparent'}
                                            color={currentReview.rating >= s ? '#d4af37' : (isEven ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}
                                        />
                                    ))}
                                </div>
                                <span className="verified-badge">VERIFIED_GOOGLE</span>
                            </div>

                            <div className="review-right">
                                <p className="quote-text">
                                    "{currentReview.comment || 'This fragrance left a profound impression on my senses.'}"
                                </p>
                                <span className="quote-date">{formatDate(currentReview.created_at)}</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress Indicators */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '40px' }}>
                        {reviews.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                style={{
                                    width: i === currentIndex ? '24px' : '6px',
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: i === currentIndex ? '#d4af37' : 'rgba(255,255,255,0.2)',
                                    transition: 'all 0.4s ease',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .carousel-section {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                
                .carousel-container {
                    position: relative;
                    min-height: 240px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    width: 95%;
                    max-width: 1800px;
                }
                
                .review-card {
                    display: flex;
                    align-items: center;
                    padding: 16px 48px;
                    height: 180px;
                    width: 100%;
                    gap: 40px;
                    transition: transform 0.4s ease;
                    background: #111;
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 16px 80px 16px 80px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                }
                
                .desktop-carousel-card {
                    max-width: 1100px;
                    margin: 0 auto;
                }
                
                .review-left {
                    width: 25%;
                    min-width: 140px;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    border-right: 1px solid rgba(212,175,55,0.2);
                    padding-right: 32px;
                }
                
                .avatar-container {
                    margin-bottom: 12px;
                }
                .reviewer-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 1px solid rgba(212,175,55,0.3);
                }
                .avatar-placeholder {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(212,175,55,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #d4af37;
                    border: 1px solid rgba(212,175,55,0.3);
                }
                
                .review-right {
                    flex: 1;
                    position: relative;
                }
                
                .reviewer-name {
                    font-size: 14px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin: 0 0 8px 0;
                    line-height: 1.4;
                    color: #d4af37;
                }
                .verified-badge {
                    font-size: 8px;
                    letter-spacing: 0.2em;
                    opacity: 0.5;
                    margin-top: 4px;
                    font-weight: 700;
                    color: #fff;
                }
                .quote-text {
                    font-size: 16px;
                    line-height: 1.8;
                    margin: 0;
                    font-weight: 400;
                    color: rgba(255,255,255,0.85);
                }
                .quote-date {
                    display: block;
                    font-size: 10px;
                    text-align: right;
                    margin-top: 12px;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    opacity: 0.3;
                    color: #fff;
                }

                @media (max-width: 1024px) {
                    .desktop-grid {
                        display: none;
                    }
                    .mobile-carousel {
                        display: block;
                    }
                    .carousel-container {
                        min-height: 0;
                    }
                    .review-card {
                        height: auto;
                        min-height: 0;
                        padding: 20px 20px;
                        gap: 12px;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    
                    .mobile-dark {
                        background: #111 !important;
                        border: 1px solid rgba(255,255,255,0.05) !important;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important;
                    }
                    .mobile-dark .reviewer-name {
                        color: #d4af37 !important;
                    }
                    .mobile-dark .verified-badge, .mobile-dark .quote-date {
                        color: #fff !important;
                    }
                    .mobile-dark .quote-text {
                        color: rgba(255,255,255,0.85) !important;
                    }
                    .mobile-dark .review-left {
                        border-right: none !important;
                        border-bottom: 1px solid rgba(212,175,55,0.2) !important;
                        width: 100% !important;
                        padding-right: 0 !important;
                        padding-bottom: 20px !important;
                    }
                    
                    .card-dark {
                        border-radius: 16px 40px 16px 40px !important;
                    }
                    .card-light {
                        border-radius: 40px 16px 40px 16px !important;
                    }
                    
                    .reviewer-name {
                        font-size: 13px;
                    }
                    .quote-date {
                        text-align: center;
                    }
                    .quote-text {
                        font-size: 14px;
                        line-height: 1.5;
                        text-align: center;
                    }
                }

                @media (max-width: 600px) {
                    .carousel-container {
                        min-height: 0;
                    }
                    .review-card {
                        height: auto;
                        min-height: 0;
                    }
                    .card-dark {
                        border-radius: 12px 30px 12px 30px !important;
                    }
                    .card-light {
                        border-radius: 30px 12px 30px 12px !important;
                    }
                    .reviewer-avatar, .avatar-placeholder {
                        width: 32px;
                        height: 32px;
                    }
                    .reviewer-name {
                        font-size: 12px;
                        margin-bottom: 4px;
                    }
                    .verified-badge {
                        font-size: 8px;
                    }
                    .quote-text {
                        font-size: 13px;
                        line-height: 1.5;
                    }
                    .review-left {
                        padding-bottom: 16px;
                    }
                    .quote-date {
                        font-size: 9px;
                        margin-top: 12px;
                    }
                }
            `}</style>
        </section>
    )
}
