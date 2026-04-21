'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Collection } from '@/types/store'

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Form state
    const [form, setForm] = useState({
        name: '',
        type: '',
        display_order: 0,
        image_url: '',
    })
    const [preview, setPreview] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)

    const supabase = createClient()

    async function fetchCollections() {
        setLoading(true)
        const { data, error } = await supabase
            .from('editorial_collections')
            .select('*')
            .order('display_order', { ascending: true })

        if (error) setError(error.message)
        else setCollections(data ?? [])
        setLoading(false)
    }

    useEffect(() => { fetchCollections() }, [])

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setError('')
        setPreview(URL.createObjectURL(file))

        const ext = file.name.split('.').pop()
        const fileName = `collection-${Date.now()}.${ext}`

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

        const payload = {
            name: form.name,
            type: form.type,
            display_order: form.display_order,
            image_url: form.image_url,
        }

        if (editingId) {
            const { error } = await supabase
                .from('editorial_collections')
                .update(payload)
                .eq('id', editingId)

            if (error) { setError(error.message); setSaving(false); return }
            setSuccess('Collection updated successfully')
        } else {
            const { error } = await supabase
                .from('editorial_collections')
                .insert(payload)

            if (error) { setError(error.message); setSaving(false); return }
            setSuccess('Collection added successfully')
        }

        resetForm()
        fetchCollections()
        setSaving(false)
    }

    function handleEdit(col: Collection) {
        setEditingId(col.id)
        setForm({
            name: col.name,
            type: col.type,
            display_order: col.display_order,
            image_url: col.image_url,
        })
        setPreview(col.image_url)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this collection?')) return
        const { error } = await supabase
            .from('editorial_collections')
            .delete()
            .eq('id', id)

        if (error) { setError(error.message); return }
        setCollections(prev => prev.filter(c => c.id !== id))
        setSuccess('Collection deleted')
    }

    function resetForm() {
        setForm({ name: '', type: '', display_order: collections.length, image_url: '' })
        setPreview('')
        setEditingId(null)
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 text-gray-900">
            <div>
                <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-gray-900">
                    {editingId ? 'Edit Collection' : 'Collections Manager'}
                </h1>
                <p className="text-gray-500 mt-2 font-light italic uppercase tracking-widest text-[10px]">Manage the editorial sections displayed in "The Collections"</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-accent text-sm">
                    {success}
                </div>
            )}

            <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Collection Image</label>
                        <div className={cn(
                            "relative aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group transition-all duration-300",
                            preview && "border-solid border-accent/30",
                            uploading && "opacity-50"
                        )}>
                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label className="cursor-pointer bg-white text-black px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-full">
                                            Replace Image
                                            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100/50 transition-colors">
                                    <p className="text-xs font-bold tracking-widest uppercase">{uploading ? 'Processing...' : 'Upload Image'}</p>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400 block">Collection Name</label>
                            <input
                                className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-accent focus:outline-none transition-colors text-sm font-light tracking-wide text-gray-900"
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                                placeholder="e.g. THE NOIR SERIES"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400 block">Collection Type / Subtitle</label>
                            <input
                                className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-accent focus:outline-none transition-colors text-sm font-light tracking-wide text-gray-900"
                                value={form.type}
                                onChange={e => setForm(p => ({ ...p, type: e.target.value.toUpperCase() }))}
                                placeholder="e.g. BOLD & DARK"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400 block">Display Order</label>
                            <input
                                type="number"
                                className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-accent focus:outline-none transition-colors text-sm font-light text-gray-900"
                                value={form.display_order}
                                onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                            />
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={saving || uploading || !form.image_url}
                            className="w-full mt-4"
                        >
                            {saving ? 'Processing...' : editingId ? 'Update Collection' : 'Add Collection'}
                        </Button>
                        {editingId && (
                            <button onClick={resetForm} className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                                Cancel Editing
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.isArray(collections) && collections.map((col) => (
                    <div key={col.id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                            <img src={col.image_url} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => handleEdit(col)} className="bg-white text-black px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded">Edit</button>
                                <button onClick={() => handleDelete(col.id)} className="bg-red-500 text-white px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded">Delete</button>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-[9px] text-accent font-bold tracking-widest mb-1">{col.type}</p>
                            <h3 className="text-sm font-bold tracking-wider uppercase text-gray-900">{col.name}</h3>
                            <p className="text-[10px] text-gray-400 mt-2">Order: {col.display_order}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
