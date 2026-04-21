'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['shoes', 'clothing', 'accessories', 'bags', 'sports']

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [images, setImages] = useState<string[]>([])

    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '',
        is_featured: false,
        meta_title: '',
        meta_description: '',
    })

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value, type } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    // Auto-fill SEO fields from name/description
    function handleNameBlur() {
        if (!form.meta_title) {
            setForm(prev => ({ ...prev, meta_title: prev.name }))
        }
    }
    function handleDescBlur() {
        if (!form.meta_description) {
            setForm(prev => ({ ...prev, meta_description: prev.description.slice(0, 160) }))
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        const supabase = createClient()
        const uploaded: string[] = []

        for (const file of Array.from(files)) {
            // Validate file type and size
            if (!file.type.startsWith('image/')) {
                setError(`${file.name} is not an image`)
                continue
            }
            if (file.size > 5 * 1024 * 1024) {
                setError(`${file.name} exceeds 5MB limit`)
                continue
            }

            const ext = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, file)

            if (uploadError) {
                setError(`Upload failed: ${uploadError.message}`)
                continue
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName)

            uploaded.push(publicUrl)
        }

        setImages(prev => [...prev, ...uploaded])
        setUploading(false)
    }

    function removeImage(url: string) {
        setImages(prev => prev.filter(img => img !== url))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (!form.name || !form.price) {
            setError('Name and price are required')
            return
        }
        if (images.length === 0) {
            setError('Please upload at least one image')
            return
        }

        setLoading(true)

        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock || '0'),
                images,
            }),
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.error || 'Something went wrong')
            setLoading(false)
            return
        }

        router.push('/admin/products')
        router.refresh()
    }

    // ── Styles ────────────────────────────────────────────────────────────────
    const card: React.CSSProperties = {
        background: '#fff', borderRadius: '12px',
        padding: '24px', marginBottom: '20px',
    }
    const label: React.CSSProperties = {
        display: 'block', fontSize: '13px',
        fontWeight: 500, marginBottom: '6px', color: '#444',
    }
    const input: React.CSSProperties = {
        width: '100%', padding: '10px 12px', borderRadius: '8px',
        border: '1px solid #e0e0e0', fontSize: '14px',
        boxSizing: 'border-box', outline: 'none',
    }
    const textarea: React.CSSProperties = {
        ...input, resize: 'vertical', minHeight: '100px',
    }

    return (
        <div style={{ maxWidth: '780px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        background: 'none', border: '1px solid #ddd', borderRadius: '8px',
                        padding: '8px 14px', cursor: 'pointer', fontSize: '13px'
                    }}
                >
                    Back
                </button>
                <h1 style={{ margin: 0, fontSize: '22px' }}>Add new product</h1>
            </div>

            {error && (
                <div style={{
                    background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
                    color: '#dc2626', fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* ── Basic info ── */}
                <div style={card}>
                    <h2 style={{ marginTop: 0, fontSize: '16px', marginBottom: '20px' }}>Basic info</h2>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={label}>Product name *</label>
                        <input
                            style={input} name="name" value={form.name}
                            onChange={handleChange} onBlur={handleNameBlur}
                            placeholder="e.g. Nike Air Max 270" required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={label}>Price (₹) *</label>
                            <input
                                style={input} name="price" type="number"
                                min="0" step="0.01" value={form.price}
                                onChange={handleChange} placeholder="499" required
                            />
                        </div>
                        <div>
                            <label style={label}>Stock quantity</label>
                            <input
                                style={input} name="stock" type="number"
                                min="0" value={form.stock}
                                onChange={handleChange} placeholder="50"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={label}>Category</label>
                            <select
                                style={input} name="category"
                                value={form.category} onChange={handleChange}
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '24px' }}>
                            <input
                                type="checkbox" id="is_featured" name="is_featured"
                                checked={form.is_featured}
                                onChange={handleChange}
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                            <label htmlFor="is_featured" style={{ ...label, margin: 0, cursor: 'pointer' }}>
                                Featured product (shown on homepage)
                            </label>
                        </div>
                    </div>

                    <div>
                        <label style={label}>Description</label>
                        <textarea
                            style={textarea} name="description"
                            value={form.description}
                            onChange={handleChange}
                            onBlur={handleDescBlur}
                            placeholder="Describe the product..."
                        />
                    </div>
                </div>

                {/* ── Images ── */}
                <div style={card}>
                    <h2 style={{ marginTop: 0, fontSize: '16px', marginBottom: '8px' }}>Product images</h2>
                    <p style={{ fontSize: '13px', color: '#888', marginTop: 0, marginBottom: '16px' }}>
                        Upload up to 5 images. First image will be the main display image. Max 5MB each.
                    </p>

                    {/* Upload button */}
                    <label style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '10px 18px', background: '#f4f4f4', borderRadius: '8px',
                        border: '1px dashed #ccc', cursor: images.length >= 5 ? 'not-allowed' : 'pointer',
                        fontSize: '14px', color: '#555', marginBottom: '16px',
                        opacity: images.length >= 5 ? 0.5 : 1,
                    }}>
                        {uploading ? 'Uploading...' : '+ Upload images'}
                        <input
                            type="file" accept="image/*" multiple
                            onChange={handleImageUpload}
                            disabled={uploading || images.length >= 5}
                            style={{ display: 'none' }}
                        />
                    </label>

                    {/* Image previews */}
                    {images.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {images.map((url, i) => (
                                <div key={url} style={{ position: 'relative' }}>
                                    <img
                                        src={url} alt={`Product ${i + 1}`}
                                        style={{
                                            width: '100px', height: '100px',
                                            objectFit: 'cover', borderRadius: '8px',
                                            border: i === 0 ? '2px solid #6366f1' : '1px solid #eee'
                                        }}
                                    />
                                    {i === 0 && (
                                        <span style={{
                                            position: 'absolute', bottom: '4px', left: '4px',
                                            background: '#6366f1', color: '#fff',
                                            fontSize: '10px', padding: '2px 6px', borderRadius: '4px',
                                        }}>
                                            Main
                                        </span>
                                    )}
                                    <button
                                        type="button" onClick={() => removeImage(url)}
                                        style={{
                                            position: 'absolute', top: '-8px', right: '-8px',
                                            background: '#ef4444', color: '#fff', border: 'none',
                                            borderRadius: '50%', width: '22px', height: '22px',
                                            cursor: 'pointer', fontSize: '12px', lineHeight: 1,
                                        }}
                                    >
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── SEO ── */}
                <div style={card}>
                    <h2 style={{ marginTop: 0, fontSize: '16px', marginBottom: '4px' }}>SEO settings</h2>
                    <p style={{ fontSize: '13px', color: '#888', marginTop: 0, marginBottom: '16px' }}>
                        Auto-filled from product name and description. Edit if needed.
                    </p>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={label}>
                            Meta title
                            <span style={{ fontWeight: 400, color: '#aaa', marginLeft: '8px' }}>
                                ({form.meta_title.length}/60)
                            </span>
                        </label>
                        <input
                            style={{
                                ...input,
                                borderColor: form.meta_title.length > 60 ? '#ef4444' : '#e0e0e0',
                            }}
                            name="meta_title" value={form.meta_title}
                            onChange={handleChange}
                            placeholder="Nike Air Max 270 | MyShop"
                        />
                    </div>

                    <div>
                        <label style={label}>
                            Meta description
                            <span style={{ fontWeight: 400, color: '#aaa', marginLeft: '8px' }}>
                                ({form.meta_description.length}/160)
                            </span>
                        </label>
                        <textarea
                            style={{
                                ...textarea,
                                minHeight: '80px',
                                borderColor: form.meta_description.length > 160 ? '#ef4444' : '#e0e0e0',
                            }}
                            name="meta_description" value={form.meta_description}
                            onChange={handleChange}
                            placeholder="Buy the best Nike Air Max 270 online at the lowest price..."
                        />
                    </div>

                    {/* Google preview */}
                    {(form.meta_title || form.name) && (
                        <div style={{
                            marginTop: '16px', padding: '16px', background: '#f8f9fa',
                            borderRadius: '8px', border: '1px solid #eee',
                        }}>
                            <p style={{ fontSize: '11px', color: '#888', margin: '0 0 8px' }}>Google preview</p>
                            <div style={{ fontSize: '18px', color: '#1a0dab', marginBottom: '4px' }}>
                                {form.meta_title || form.name}
                            </div>
                            <div style={{ fontSize: '13px', color: '#006621', marginBottom: '4px' }}>
                                yourshop.com/products/{form.name.toLowerCase().replace(/\s+/g, '-')}
                            </div>
                            <div style={{ fontSize: '13px', color: '#545454' }}>
                                {form.meta_description || form.description || 'No description yet.'}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Submit ── */}
                <div style={{ display: 'flex', gap: '12px', paddingBottom: '40px' }}>
                    <button
                        type="submit" disabled={loading || uploading}
                        style={{
                            padding: '12px 32px', background: loading ? '#a5b4fc' : '#6366f1',
                            color: '#fff', border: 'none', borderRadius: '8px',
                            fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 500,
                        }}
                    >
                        {loading ? 'Saving...' : 'Save product'}
                    </button>
                    <button
                        type="button" onClick={() => router.back()}
                        style={{
                            padding: '12px 24px', background: '#fff', color: '#555',
                            border: '1px solid #ddd', borderRadius: '8px',
                            fontSize: '15px', cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    )
}