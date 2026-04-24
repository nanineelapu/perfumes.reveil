'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Trash2, Edit2, Plus, ExternalLink, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
    const [products, setProducts] = useState<{ id: string, name: string }[]>([])

    // Form state
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
        if (!confirm('Are you sure you want to delete this review?')) return
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
        <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>Customer Reviews</h1>
                    <p style={{ margin: '8px 0 0', color: '#666' }}>Manage and curate your customer experiences</p>
                </div>
                <button
                    onClick={() => { setEditingReview(null); setForm({ reviewer_name: '', reviewer_avatar: '', rating: 5, comment: '', product_id: '', is_featured: false }); setIsModalOpen(true); }}
                    style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}
                >
                    <Plus size={18} /> Add Review
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '100px', textAlign: 'center', color: '#666' }}>Loading reviews...</div>
            ) : (
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#666' }}>REVIEWER</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#666' }}>PRODUCT</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#666' }}>RATING</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#666' }}>COMMENT</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#666' }}>FEATURED</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#666' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map(review => (
                                <tr key={review.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee', overflow: 'hidden' }}>
                                                {(review.reviewer_avatar) ? (
                                                    <img src={review.reviewer_avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>?</div>
                                                )}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{review.reviewer_name || review.profiles?.full_name || 'Anonymous'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#666', fontSize: '14px' }}>
                                        {review.products?.name || 'General'}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= review.rating ? '#fbbf24' : 'none'} color={s <= review.rating ? '#fbbf24' : '#ddd'} />)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', maxWidth: '300px' }}>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {review.comment}
                                        </p>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <button
                                            onClick={() => toggleFeatured(review)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            {review.is_featured ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ddd" />}
                                        </button>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button onClick={() => openEdit(review)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(review.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 24px' }}>{editingReview ? 'Edit Review' : 'Add Manual Review'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Reviewer Name</label>
                                <input
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    value={form.reviewer_name}
                                    onChange={e => setForm({ ...form, reviewer_name: e.target.value })}
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Reviewer Avatar URL</label>
                                <input
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    value={form.reviewer_avatar}
                                    onChange={e => setForm({ ...form, reviewer_avatar: e.target.value })}
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Rating (1-5)</label>
                                    <input
                                        type="number" min="1" max="5"
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        value={form.rating}
                                        onChange={e => setForm({ ...form, rating: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Product</label>
                                    <select
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        value={form.product_id}
                                        onChange={e => setForm({ ...form, product_id: e.target.value })}
                                    >
                                        <option value="">General Review</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Comment</label>
                                <textarea
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '100px', resize: 'vertical' }}
                                    value={form.comment}
                                    onChange={e => setForm({ ...form, comment: e.target.value })}
                                    placeholder="Review content..."
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox" id="modal_featured"
                                    checked={form.is_featured}
                                    onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                                />
                                <label htmlFor="modal_featured" style={{ fontSize: '14px' }}>Feature on homepage</label>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" style={{ flex: 1, background: '#000', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                    {editingReview ? 'Update' : 'Save'}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: '#f5f5f5', color: '#333', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
