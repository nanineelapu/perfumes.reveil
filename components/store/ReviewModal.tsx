'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Loader2, CheckCircle } from 'lucide-react'

interface ReviewModalProps {
    isOpen: boolean
    onClose: () => void
    product: {
        id: string
        name: string
    }
    orderId?: string
}

export function ReviewModal({ isOpen, onClose, product, orderId }: ReviewModalProps) {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async () => {
        if (rating === 0) return
        setSubmitting(true)
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: product.id,
                    rating,
                    comment,
                    order_id: orderId
                })
            })
            if (res.ok) {
                setSubmitted(true)
                setTimeout(() => {
                    onClose()
                    setSubmitted(false)
                    setRating(0)
                    setComment('')
                }, 2000)
            }
        } catch (error) {
            console.error('Error submitting review:', error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
                    />
                    
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        style={{
                            background: '#111',
                            border: '1px solid rgba(212,175,55,0.2)',
                            width: '100%',
                            maxWidth: '500px',
                            position: 'relative',
                            padding: '48px',
                            borderRadius: '4px',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
                        }}
                    >
                        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>

                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                    <CheckCircle size={64} color="#d4af37" style={{ margin: '0 auto 24px' }} />
                                </motion.div>
                                <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-baskerville)', color: '#fff', marginBottom: '16px' }}>Experience Archived</h2>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontStyle: 'italic' }}>Thank you for sharing your olfactory journey with us.</p>
                            </div>
                        ) : (
                            <>
                                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                                    <p style={{ fontSize: '10px', color: '#d4af37', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '12px' }}>Share your Experience</p>
                                    <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-baskerville)', color: '#fff', fontWeight: 300, margin: 0 }}>{product.name}</h2>
                                </header>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                            key={star}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                        >
                                            <Star 
                                                size={32} 
                                                fill={(hoveredRating || rating) >= star ? '#d4af37' : 'transparent'} 
                                                color={(hoveredRating || rating) >= star ? '#d4af37' : 'rgba(255,255,255,0.1)'} 
                                                strokeWidth={1.5}
                                            />
                                        </motion.button>
                                    ))}
                                </div>

                                <div style={{ marginBottom: '40px' }}>
                                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>Personal Notes (Optional)</p>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Describe the scent evolution, longevity, and your impressions..."
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '2px',
                                            color: '#fff',
                                            padding: '16px',
                                            fontSize: '14px',
                                            fontFamily: 'var(--font-baskerville)',
                                            minHeight: '120px',
                                            outline: 'none',
                                            resize: 'none'
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={rating === 0 || submitting}
                                    style={{
                                        width: '100%',
                                        background: rating === 0 ? 'rgba(255,255,255,0.05)' : '#fff',
                                        color: '#000',
                                        border: 'none',
                                        padding: '18px',
                                        fontSize: '11px',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.4em',
                                        cursor: rating === 0 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        transition: '0.3s'
                                    }}
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Submit Review'}
                                </button>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
