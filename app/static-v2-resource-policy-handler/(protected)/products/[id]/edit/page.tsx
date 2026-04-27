'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react'
import Link from 'next/link'

type Params = Promise<{ id: string }>

export default function EditProductPage(props: { params: Params }) {
    const params = use(props.params)
    const id = params.id
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [product, setProduct] = useState<any>(null)
    const [categories, setCategories] = useState<{id: string, name: string}[]>([])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const { data: pData } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()
            
            const cRes = await fetch('/api/categories')
            const cData = await cRes.json()

            if (pData) setProduct(pData)
            if (Array.isArray(cData)) setCategories(cData)
            
            setLoading(false)
        }
        fetchData()
    }, [id, supabase])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSaving(true)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string

        // Auto-generate slug if not provided, or ensure it's clean
        const slug = formData.get('slug') as string || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

        const body = {
            name,
            slug,
            description: formData.get('description'),
            price: Number(formData.get('price')),
            stock: Number(formData.get('stock')),
            category: formData.get('category'),
            is_featured: formData.get('is_featured') === 'on',
            // Handle images as a comma-separated list converted to array
            images: (formData.get('images') as string).split(',').map(s => s.trim()).filter(s => s !== '')
        }

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                router.push('/static-v2-resource-policy-handler/products')
                router.refresh()
            } else {
                const err = await res.json()
                alert(`Error: ${err.error}`)
            }
        } catch (error) {
            console.error('Update failed:', error)
            alert('Failed to update product')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-light text-gray-500 uppercase tracking-widest">Fragrance Not Found</h2>
                <Link href="/static-v2-resource-policy-handler/products" className="text-accent text-sm mt-4 inline-block underline underline-offset-4 font-bold tracking-widest uppercase">
                    Return to Collection
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                    <Link href="/static-v2-resource-policy-handler/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-gray-900 leading-none">
                            Edit Essence
                        </h1>
                        <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-2 italic flex items-center gap-2">
                            Modifying profile for <span className="text-accent tracking-normal underline">#{product.id.slice(0, 8).toUpperCase()}</span>
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Principal Details */}
                <div className="md:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2 text-accent">
                            <Sparkles className="w-4 h-4" />
                            <h2 className="text-[10px] font-bold tracking-[.3em] uppercase">Identity & Narrative</h2>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Product Name</label>
                            <input
                                name="name"
                                defaultValue={product.name}
                                required
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent transition-all font-medium"
                                placeholder="Golden Oud..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Slug Handle</label>
                                <input
                                    name="slug"
                                    defaultValue={product.slug}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent transition-all font-mono"
                                    placeholder="golden-oud-parfum"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Collection Group</label>
                                <select
                                    name="category"
                                    defaultValue={product.category}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent transition-all appearance-none font-medium"
                                >
                                    <option value="">Select category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Description Narrative</label>
                            <textarea
                                name="description"
                                defaultValue={product.description}
                                rows={6}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-sm focus:ring-1 focus:ring-accent transition-all leading-relaxed whitespace-pre-line"
                                placeholder="Describe the olfactory journey..."
                            />
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2 text-accent">
                            <ImageIcon className="w-4 h-4" />
                            <h2 className="text-[10px] font-bold tracking-[.3em] uppercase">Visual Assets</h2>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Image URLs (Comma Separated)</label>
                            <textarea
                                name="images"
                                defaultValue={product.images?.join(', ')}
                                rows={3}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-[11px] font-mono focus:ring-1 focus:ring-accent transition-all"
                                placeholder="https://image1.jpg, https://image2.jpg..."
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4 pt-2">
                            {product.images?.map((img: string, i: number) => (
                                <div key={i} className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group">
                                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Preview" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Inventory & Stats */}
                <div className="space-y-8">
                    <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block">Valuation (₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-light text-sm">₹</span>
                                <input
                                    name="price"
                                    type="number"
                                    defaultValue={product.price}
                                    required
                                    className="w-full bg-gray-50 border-none rounded-xl pl-8 pr-4 py-4 text-lg font-medium focus:ring-1 focus:ring-accent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block">Current Inventory</label>
                            <input
                                name="stock"
                                type="number"
                                defaultValue={product.stock}
                                required
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-lg font-medium focus:ring-1 focus:ring-accent transition-all"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-50">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        defaultChecked={product.is_featured}
                                        className="peer sr-only"
                                    />
                                    <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-accent transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform shadow-sm"></div>
                                </div>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 group-hover:text-accent transition-colors">
                                    Promote to Featured Selection
                                </span>
                            </label>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-gray-900 border border-gray-900 text-white rounded-2xl py-5 px-8 font-bold text-[10px] tracking-[.3em] uppercase hover:bg-white hover:text-gray-900 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Commit Changes
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('Are you sure you want to retire this fragrance?')) {
                                fetch(`/api/products/${id}`, { method: 'DELETE' })
                                    .then(() => router.push('/static-v2-resource-policy-handler/products'))
                            }
                        }}
                        className="w-full border border-red-50/50 bg-red-50/20 text-red-500 rounded-2xl py-4 font-bold text-[9px] tracking-widest uppercase hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-3 h-3" />
                        Retire Fragrance
                    </button>
                </div>
            </form>
        </div>
    )
}