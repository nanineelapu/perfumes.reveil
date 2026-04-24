'use client'
import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, ChevronRight, Package, Loader2, Folder, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Category {
    id: string
    name: string
    slug: string
}

interface Product {
    id: string
    name: string
    price: number
    stock: number
    images: string[]
    category: string
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCatModalOpen, setIsCatModalOpen] = useState(false)
    const [editingCat, setEditingCat] = useState<Category | null>(null)
    const [catForm, setCatForm] = useState({ name: '' })

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        try {
            const [cRes, pRes] = await Promise.all([
                fetch('/api/categories'),
                fetch('/api/products?limit=1000') // Fetch more for backend management
            ])
            const cData = await cRes.json()
            const pData = await pRes.json()
            
            if (Array.isArray(cData)) {
                setCategories(cData)
                if (cData.length > 0) setSelectedCategory(cData[0].name)
            }
            if (pData.products) setProducts(pData.products)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleCatSubmit(e: React.FormEvent) {
        e.preventDefault()
        const method = editingCat ? 'PATCH' : 'POST'
        const body = editingCat ? { id: editingCat.id, ...catForm } : catForm

        try {
            const res = await fetch('/api/categories', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            if (res.ok) {
                setIsCatModalOpen(false)
                setEditingCat(null)
                setCatForm({ name: '' })
                fetchData()
            }
        } catch (error) {
            console.error('Error saving category:', error)
        }
    }

    async function deleteCategory(id: string) {
        if (!confirm('This will delete the category classification. Products will remain but will be uncategorized. Proceed?')) return
        try {
            const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
            if (res.ok) fetchData()
        } catch (error) {
            console.error('Error deleting category:', error)
        }
    }

    const filteredProducts = products.filter(p => {
        const matchesCat = selectedCategory ? p.category === selectedCategory : true
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.id.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCat && matchesSearch
    })

    const productCounts = categories.reduce((acc, cat) => {
        acc[cat.name] = products.filter(p => p.category === cat.name).length
        return acc
    }, {} as Record<string, number>)

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', margin: '-32px' }}>
            {/* Sidebar: Categories List */}
            <aside style={{ width: '300px', background: '#fff', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Collections</h2>
                    <button 
                        onClick={() => { setEditingCat(null); setCatForm({ name: '' }); setIsCatModalOpen(true); }}
                        style={{ background: '#000', color: '#fff', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                    {categories.map(cat => (
                        <div 
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.name)}
                            style={{ 
                                padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                                background: selectedCategory === cat.name ? '#f5f5f5' : 'transparent',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: '4px', transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Folder size={16} color={selectedCategory === cat.name ? '#000' : '#999'} />
                                <span style={{ fontSize: '14px', fontWeight: selectedCategory === cat.name ? 600 : 400 }}>{cat.name}</span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#999', background: '#eee', padding: '2px 8px', borderRadius: '10px' }}>
                                {productCounts[cat.name] || 0}
                            </span>
                        </div>
                    ))}
                </div>
                <div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
                    <p style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Collections: {categories.length}</p>
                </div>
            </aside>

            {/* Main Content: Product Management for Selected Category */}
            <main style={{ flex: 1, background: '#fcfcfc', overflowY: 'auto', padding: '40px' }}>
                {selectedCategory ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                            <div>
                                <h1 style={{ fontSize: '32px', fontWeight: 600, margin: 0 }}>{selectedCategory}</h1>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button 
                                        onClick={() => {
                                            const cat = categories.find(c => c.name === selectedCategory)
                                            if (cat) { setEditingCat(cat); setCatForm({ name: cat.name }); setIsCatModalOpen(true); }
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <Edit2 size={14} /> Rename Collection
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const cat = categories.find(c => c.name === selectedCategory)
                                            if (cat) deleteCategory(cat.id)
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <Trash2 size={14} /> Remove Collection
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={16} />
                                    <input 
                                        placeholder="Search products in this collection..."
                                        style={{ padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid #eee', width: '300px', outline: 'none', fontSize: '14px' }}
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Link href="/admin@reveil/products/new">
                                    <button style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                                        + Add Product
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Products List for Category */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                            {filteredProducts.map(product => (
                                <div 
                                    key={product.id}
                                    style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '16px' }}
                                >
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#f5f5f5', overflow: 'hidden' }}>
                                            <img src={product.images?.[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{product.name}</h3>
                                            <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0' }}>ID: {product.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '12px 0', borderTop: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5' }}>
                                        <div>
                                            <span style={{ color: '#999', fontSize: '12px', display: 'block' }}>PRICE</span>
                                            <strong>₹{product.price.toLocaleString()}</strong>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ color: '#999', fontSize: '12px', display: 'block' }}>STOCK</span>
                                            <strong style={{ color: product.stock < 10 ? '#ef4444' : '#000' }}>{product.stock} Units</strong>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <Link href={`/admin@reveil/products/${product.id}/edit`} style={{ flex: 1, textDecoration: 'none' }}>
                                            <button style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #eee', background: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                <Edit2 size={14} /> Edit
                                            </button>
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                if (confirm('Delete this product?')) {
                                                    fetch(`/api/products/${product.id}`, { method: 'DELETE' }).then(() => fetchData())
                                                }
                                            }}
                                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div style={{ gridColumn: '1 / -1', padding: '100px', textAlign: 'center', color: '#999' }}>
                                    <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                                    <p>No products found in this collection.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                        <Folder size={64} style={{ marginBottom: '24px', opacity: 0.1 }} />
                        <h2>Select a collection to manage products</h2>
                    </div>
                )}
            </main>

            {/* Category Modal */}
            <AnimatePresence>
                {isCatModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ background: '#fff', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}
                        >
                            <h2 style={{ margin: '0 0 24px' }}>{editingCat ? 'Rename Collection' : 'Create Collection'}</h2>
                            <form onSubmit={handleCatSubmit}>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Collection Name</label>
                                    <input 
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' }} 
                                        value={catForm.name}
                                        onChange={e => setCatForm({ name: e.target.value })}
                                        placeholder="e.g. Luxury Ouds"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="submit" style={{ flex: 1, background: '#000', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                        {editingCat ? 'Update' : 'Create'}
                                    </button>
                                    <button type="button" onClick={() => setIsCatModalOpen(false)} style={{ flex: 1, background: '#f5f5f5', color: '#333', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
