'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function TrendingPage() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [form, setForm] = useState({
        name: '',
        type: '',
        price: 0,
        display_order: 0,
        image_url: '',
    })
    const [preview, setPreview] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)

    const supabase = createClient()

    async function fetchItems() {
        setLoading(true)
        const { data, error } = await supabase
            .from('homepage_curation')
            .select('*')
            .order('display_order', { ascending: true })

        if (error) setError(error.message)
        else setItems(data ?? [])
        setLoading(false)
    }

    useEffect(() => { fetchItems() }, [])

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setError('')
        setPreview(URL.createObjectURL(file))

        const ext = file.name.split('.').pop()
        const fileName = `trending-${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file)

        if (uploadError) {
            setError(`Upload failed: ${uploadError.message}`)
            setUploading(false)
            return
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

        setForm(prev => ({ ...prev, image_url: publicUrl }))
        setUploading(false)
    }

    async function handleSave() {
        if (!form.name || !form.image_url) {
            setError('Name and image are required')
            return
        }

        setSaving(true)
        setError('')
        setSuccess('')

        if (editingId) {
            const { error } = await supabase
                .from('homepage_curation')
                .update(form)
                .eq('id', editingId)

            if (error) { setError(error.message); setSaving(false); return }
            setSuccess('Item updated')
        } else {
            const { error } = await supabase
                .from('homepage_curation')
                .insert(form)

            if (error) { setError(error.message); setSaving(false); return }
            setSuccess('Item added')
        }

        resetForm()
        fetchItems()
        setSaving(false)
    }

    function handleEdit(item: any) {
        setEditingId(item.id)
        setForm({
            name: item.name,
            type: item.type,
            price: item.price ?? 0,
            display_order: item.display_order,
            image_url: item.image_url,
        })
        setPreview(item.image_url)
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this item?')) return
        const { error } = await supabase.from('homepage_curation').delete().eq('id', id)
        if (error) setError(error.message)
        else {
            setItems(prev => prev.filter(i => i.id !== id))
            setSuccess('Deleted')
        }
    }

    function resetForm() {
        setForm({ name: '', type: '', price: 0, display_order: items.length, image_url: '' })
        setPreview('')
        setEditingId(null)
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 text-gray-900">
            <div>
                <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-gray-900">
                    Trending Curation
                </h1>
                <p className="text-gray-500 mt-2 font-light italic uppercase tracking-widest text-[10px]">Manage the Trending Curation section on the homepage</p>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 text-sm">{error}</div>}
            {success && <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-accent text-sm">{success}</div>}

            <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Curation Image</label>
                        <div className={cn(
                            "relative aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden",
                            preview && "border-solid",
                            uploading && "opacity-50"
                        )}>
                            {preview ? (
                                <>
                                    <img src={preview} alt="" className="w-full h-full object-cover" />
                                    <label className="absolute bottom-4 cursor-pointer bg-white text-black px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg">
                                        Change
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                </>
                            ) : (
                                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                    <span className="text-xs font-bold tracking-widest uppercase">{uploading ? 'Processing...' : 'Upload Image'}</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400">Title</label>
                            <input
                                className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-accent outline-none text-sm tracking-wide"
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="e.g. OUDH NOIR"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400">Subtitle / Type</label>
                            <input
                                className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-accent outline-none text-sm tracking-wide"
                                value={form.type}
                                onChange={e => setForm(p => ({ ...p, type: e.target.value.toUpperCase() }))}
                                placeholder="e.g. PREMIER EXTRAIT"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400">Price (₹)</label>
                            <input
                                type="number"
                                className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-accent outline-none text-sm"
                                value={form.price}
                                onChange={e => setForm(p => ({ ...p, price: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400">Order</label>
                            <input
                                type="number"
                                className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-accent outline-none text-sm"
                                value={form.display_order}
                                onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                        <Button onClick={handleSave} disabled={saving || uploading || !form.image_url} className="w-full">
                            {saving ? 'Saving...' : editingId ? 'Update Item' : 'Add to Curation'}
                        </Button>
                        {editingId && <button onClick={resetForm} className="text-[10px] text-gray-400 uppercase tracking-widest">Cancel</button>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="aspect-square relative overflow-hidden bg-gray-100">
                            <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => handleEdit(item)} className="bg-white text-black px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded">Delete</button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[9px] text-accent font-bold tracking-widest mb-1">{item.type}</p>
                                    <h3 className="text-sm font-bold tracking-wider uppercase">{item.name}</h3>
                                </div>
                                <p className="text-xs font-bold text-gray-900">₹{item.price?.toLocaleString() ?? 0}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
