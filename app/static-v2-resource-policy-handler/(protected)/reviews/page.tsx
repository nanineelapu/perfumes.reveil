'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Trash2, Edit2, Plus, CheckCircle, XCircle, User, MessageSquare, Tag, Sparkles, Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Review {
    id: string
    rating: number
    comment: string
    created_at: string
    reviewer_name: string | null
    reviewer_avatar: string | null
    is_featured: boolean
    product_id: string | null
    products: { name: string } | null
    profiles: { full_name: string } | null
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingReview, setEditingReview] = useState<Review | null>(null)
    const [products, setProducts] = useState<{id: string, name: string}[]>([])
    
    const [form, setForm] = useState({
        reviewer_name: '',
        reviewer_avatar: '',
        rating: 5,
        comment: '',
        product_id: '',
        is_featured: false
    })

    const router = useRouter()

    useEffect(() => {
        fetchReviews()
        fetchProducts()
    }, [])

    async function fetchReviews() {
        setLoading(true)
        try {
            const res = await fetch('/api/reviews?admin=true')
            const data = await res.json()
            if (data.reviews) setReviews(data.reviews)
        } catch (error) {
            console.error('Error fetching reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    async function fetchProducts() {
        try {
            const res = await fetch('/api/products?limit=100')
            const data = await res.json()
            if (data.products) setProducts(data.products)
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Permanently remove this testimonial from the archive?')) return
        try {
            const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setReviews(prev => prev.filter(r => r.id !== id))
            }
        } catch (error) {
            console.error('Error deleting review:', error)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const method = editingReview ? 'PATCH' : 'POST'
        const body = editingReview ? { id: editingReview.id, ...form } : form

        try {
            const res = await fetch('/api/reviews', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            if (res.ok) {
                setIsModalOpen(false)
                setEditingReview(null)
                setForm({ reviewer_name: '', reviewer_avatar: '', rating: 5, comment: '', product_id: '', is_featured: false })
                fetchReviews()
            }
        } catch (error) {
            console.error('Error saving review:', error)
        }
    }

    function openEdit(review: Review) {
        setEditingReview(review)
        setForm({
            reviewer_name: review.reviewer_name || '',
            reviewer_avatar: review.reviewer_avatar || '',
            rating: review.rating,
            comment: review.comment || '',
            product_id: review.product_id || '',
            is_featured: review.is_featured
        })
        setIsModalOpen(true)
    }

    async function toggleFeatured(review: Review) {
        try {
            const res = await fetch('/api/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: review.id, is_featured: !review.is_featured })
            })
            if (res.ok) {
                setReviews(prev => prev.map(r => r.id === review.id ? { ...r, is_featured: !r.is_featured } : r))
            }
        } catch (error) {
            console.error('Error toggling featured status:', error)
        }
    }

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
            {/* Elegant Header */}
            <header style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d4af37', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '16px' }}>
                        Curation <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.4)' }} />
                    </div>
                    <h1 style={{ fontSize: '56px', fontFamily: 'serif', textTransform: 'uppercase', margin: 0, fontWeight: 300, letterSpacing: '-0.02em', color: '#1a1a1a' }}>
                        Customer <span style={{ fontStyle: 'italic', color: '#d4af37' }}>Archive</span>
                    </h1>
                    <p style={{ marginTop: '12px', color: '#999', fontSize: '14px', letterSpacing: '0.05em' }}>Managing the voice of the REVEIL community</p>
                </div>
                <button 
                    onClick={() => { setEditingReview(null); setForm({ reviewer_name: '', reviewer_avatar: '', rating: 5, comment: '', product_id: '', is_featured: false }); setIsModalOpen(true); }}
                    style={{ 
                        background: '#000', color: '#fff', border: '1px solid #000', 
                        padding: '18px 40px', borderRadius: '4px', cursor: 'pointer', 
                        display: 'flex', alignItems: 'center', gap: '12px', 
                        fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', 
                        letterSpacing: '0.3em', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                    className="hover-gold"
                >
                    <Plus size={16} strokeWidth={3} /> Add Testimonial
                </button>
            </header>

            {loading ? (
                <div style={{ padding: '160px', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" style={{ margin: '0 auto 20px', color: '#d4af37' }} size={32} />
                    <div style={{ color: '#999', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Synchronizing Archive...</div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '40px' }}>
                    {reviews.map((review, idx) => (
                        <motion.div 
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08, duration: 0.6 }}
                            style={{ 
                                background: '#fff', padding: '48px', borderRadius: '8px',
                                border: '1px solid rgba(0,0,0,0.04)', position: 'relative',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
                                display: 'flex', flexDirection: 'column', gap: '24px',
                                transition: 'all 0.3s ease'
                            }}
                            className="review-card"
                        >
                            <Quote style={{ position: 'absolute', top: '24px', right: '24px', color: 'rgba(212,175,55,0.08)', width: '60px', height: '60px' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ 
                                        width: '64px', height: '64px', borderRadius: '50%', 
                                        background: '#fcfcfc', overflow: 'hidden', 
                                        border: '1px solid rgba(212,175,55,0.2)',
                                        padding: '3px'
                                    }}>
                                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#f5f5f5' }}>
                                            {review.reviewer_avatar ? (
                                                <img src={review.reviewer_avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                                    <User size={24} strokeWidth={1} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.01em' }}>{review.reviewer_name || review.profiles?.full_name || 'Anonymous'}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= review.rating ? '#d4af37' : 'none'} color={s <= review.rating ? '#d4af37' : '#eee'} />)}
                                            </div>
                                            <span style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>• Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px', fontWeight: 700 }}>
                                    Regarding: {review.products?.name || 'Brand Experience'}
                                </div>
                                <p style={{ 
                                    margin: 0, fontSize: '17px', lineHeight: 1.8, color: '#333', 
                                    fontStyle: 'italic', fontFamily: 'serif', fontWeight: 400
                                }}>
                                    "{review.comment}"
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', gap: '24px' }}>
                                    <button onClick={() => openEdit(review)} style={{ background: 'none', border: 'none', color: '#1a1a1a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="action-link">
                                        <Edit2 size={13} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(review.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="action-link-red">
                                        <Trash2 size={13} /> Remove
                                    </button>
                                </div>
                                <button 
                                    onClick={() => toggleFeatured(review)}
                                    style={{ 
                                        background: review.is_featured ? '#000' : 'transparent', 
                                        border: '1px solid #000', 
                                        padding: '8px 20px', borderRadius: '4px', cursor: 'pointer',
                                        fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em',
                                        color: review.is_featured ? '#fff' : '#000',
                                        display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    {review.is_featured ? <Sparkles size={12} color="#d4af37" /> : null}
                                    {review.is_featured ? 'Featured' : 'Promote'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Premium Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
                    >
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            style={{ background: '#fff', padding: '32px', borderRadius: '4px', width: '100%', maxWidth: '500px', boxShadow: '0 50px 100px rgba(0,0,0,0.3)', position: 'relative' }}
                        >
                            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><XCircle size={20} /></button>
                            
                            <h2 style={{ fontSize: '24px', fontFamily: 'serif', textTransform: 'uppercase', margin: '0 0 32px', fontWeight: 300, textAlign: 'center', letterSpacing: '-0.02em' }}>
                                Testimonial <span style={{ fontStyle: 'italic', color: '#d4af37' }}>Entry</span>
                            </h2>
                            
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="input-group">
                                        <label style={{ display: 'block', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999', marginBottom: '8px' }}>Contributor</label>
                                        <input 
                                            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease', background: 'transparent' }} 
                                            className="custom-input"
                                            value={form.reviewer_name}
                                            onChange={e => setForm({ ...form, reviewer_name: e.target.value })}
                                            placeholder="Name..."
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999', marginBottom: '8px' }}>Rating</label>
                                        <select 
                                            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '14px', outline: 'none', background: 'transparent', cursor: 'pointer' }} 
                                            value={form.rating}
                                            onChange={e => setForm({ ...form, rating: parseInt(e.target.value) })}
                                        >
                                            <option value="5">5 — Exceptional</option>
                                            <option value="4">4 — Superior</option>
                                            <option value="3">3 — Average</option>
                                            <option value="2">2 — Limited</option>
                                            <option value="1">1 — Poor</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label style={{ display: 'block', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999', marginBottom: '8px' }}>Avatar URL</label>
                                    <input 
                                        style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '13px', outline: 'none', background: 'transparent' }} 
                                        value={form.reviewer_avatar}
                                        onChange={e => setForm({ ...form, reviewer_avatar: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="input-group">
                                    <label style={{ display: 'block', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999', marginBottom: '8px' }}>Product</label>
                                    <select 
                                        style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '13px', outline: 'none', background: 'transparent', cursor: 'pointer' }} 
                                        value={form.product_id}
                                        onChange={e => setForm({ ...form, product_id: e.target.value })}
                                    >
                                        <option value="">General Narrative</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label style={{ display: 'block', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999', marginBottom: '8px' }}>Testimonial</label>
                                    <textarea 
                                        style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '15px', outline: 'none', minHeight: '60px', resize: 'none', fontFamily: 'serif', fontStyle: 'italic', background: 'transparent', lineHeight: 1.5 }} 
                                        value={form.comment}
                                        onChange={e => setForm({ ...form, comment: e.target.value })}
                                        placeholder="Describe the experience..."
                                        required
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fcfcfc', padding: '12px', borderRadius: '4px', border: '1px solid #eee' }}>
                                    <input 
                                        type="checkbox" id="modal_featured" 
                                        checked={form.is_featured}
                                        onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                                        style={{ width: '14px', height: '14px', accentColor: '#000', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="modal_featured" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>Feature in Public Showcase</label>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                    <button type="submit" style={{ flex: 1, background: '#000', color: '#fff', border: 'none', padding: '14px', borderRadius: '2px', cursor: 'pointer', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                                        {editingReview ? 'Update' : 'Save'}
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'none', color: '#999', border: '1px solid #eee', padding: '14px', borderRadius: '2px', cursor: 'pointer', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .custom-input:focus {
                    border-bottom-color: #d4af37 !important;
                }
                .hover-gold:hover {
                    background: #d4af37 !important;
                    border-color: #d4af37 !important;
                    transform: translateY(-2px);
                }
                .review-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.08);
                    border-color: rgba(212,175,55,0.2);
                }
                .action-link:hover {
                    color: #d4af37 !important;
                }
                .action-link-red:hover {
                    color: #ff1a1a !important;
                    opacity: 1;
                }
            `}</style>
        </div>
    )
}

function Loader2({ className, size, style }: any) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
            style={style}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
