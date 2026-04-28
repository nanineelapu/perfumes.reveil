'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

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
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
            <header style={{ marginBottom: '80px', textAlign: 'center', position: 'relative' }}>
                <div style={{ 
                    width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #d4af37)', 
                    margin: '0 auto 32px', opacity: 0.5 
                }} />
                <p style={{ 
                    fontSize: '11px', color: '#d4af37', letterSpacing: '0.6em', 
                    textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600,
                    fontFamily: 'var(--font-tenor)'
                }}>
                    Archives of Scent
                </p>
                <h2 style={{ 
                    fontSize: 'clamp(32px, 4vw, 48px)', fontFamily: 'var(--font-baskerville)', 
                    color: '#fff', fontWeight: 400, margin: 0, letterSpacing: '-0.02em' 
                }}>
                    Customer Reviews
                </h2>
            </header>

            {reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
                    {reviews.map((review, idx) => {
                        const profile = Array.isArray(review.profiles) ? review.profiles[0] : review.profiles;
                        const name = review.reviewer_name || profile?.full_name || 'Anonymous Collector';
                        const avatar = review.reviewer_avatar || profile?.avatar_url;

                        return (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.8 }}
                                style={{ 
                                    borderBottom: '1px solid rgba(255,255,255,0.03)', 
                                    paddingBottom: '64px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        {avatar && (
                                            <img 
                                                src={avatar} 
                                                alt={name} 
                                                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(212,175,55,0.3)' }} 
                                            />
                                        )}
                                        <div>
                                            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star 
                                                        key={s} 
                                                        size={12} 
                                                        fill={review.rating >= s ? '#d4af37' : 'transparent'} 
                                                        color={review.rating >= s ? '#d4af37' : 'rgba(255,255,255,0.1)'} 
                                                    />
                                                ))}
                                            </div>
                                            <h4 style={{ fontSize: '18px', fontFamily: 'var(--font-baskerville)', color: '#fff', margin: 0, fontWeight: 300 }}>
                                                {name}
                                            </h4>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '10px', color: '#444', letterSpacing: '0.1em', fontFamily: 'var(--font-tenor)' }}>{formatDate(review.created_at)}</span>
                                </div>

                                <p style={{ 
                                    fontSize: '16px', 
                                    color: 'rgba(255,255,255,0.5)', 
                                    lineHeight: 1.8, 
                                    fontFamily: 'var(--font-baskerville)', 
                                    fontStyle: 'italic',
                                    maxWidth: '800px',
                                    margin: 0
                                }}>
                                    "{review.comment || 'This fragrance left a profound impression on my senses.'}"
                                </p>
                            </motion.div>
                        )
                    })}
                </div>

            ) : (
                <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed rgba(212,175,55,0.1)', borderRadius: '2px' }}>
                    <p style={{ color: '#444', fontSize: '14px', fontStyle: 'italic', fontFamily: 'var(--font-baskerville)' }}>No reviews have been archived for this fragment yet.</p>
                </div>
            )}
        </section>
    )
}
