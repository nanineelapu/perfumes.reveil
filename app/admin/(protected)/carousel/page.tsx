'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Slide = {
    id: string
    title: string | null
    image_url: string
    link: string | null
    display_order: number
    is_active: boolean
}

export default function CarouselPage() {
    const [slides, setSlides] = useState<Slide[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Form state for new slide
    const [form, setForm] = useState({
        title: '',
        link: '',
        display_order: 0,
        is_active: true,
        image_url: '',
    })
    const [preview, setPreview] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)

    const supabase = createClient()

    // ── Fetch slides ────────────────────────────────────────────────────────
    async function fetchSlides() {
        setLoading(true)
        const { data, error } = await supabase
            .from('carousel_slides')
            .select('*')
            .order('display_order', { ascending: true })

        if (error) setError(error.message)
        else setSlides(data ?? [])
        setLoading(false)
    }

    useEffect(() => { fetchSlides() }, [])

    // ── Image upload ────────────────────────────────────────────────────────
    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be under 5MB')
            return
        }

        setUploading(true)
        setError('')

        // Show local preview immediately
        setPreview(URL.createObjectURL(file))

        const ext = file.name.split('.').pop()
        const fileName = `carousel-${Date.now()}.${ext}`

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

    // ── Save (create or update) ──────────────────────────────────────────────
    async function handleSave() {
        if (!form.image_url) {
            setError('Please upload an image')
            return
        }

        setSaving(true)
        setError('')
        setSuccess('')

        if (editingId) {
            // Update existing
            const { error } = await supabase
                .from('carousel_slides')
                .update({
                    title: form.title || null,
                    link: form.link || null,
                    display_order: form.display_order,
                    is_active: form.is_active,
                    image_url: form.image_url,
                })
                .eq('id', editingId)

            if (error) { setError(error.message); setSaving(false); return }
            setSuccess('Slide updated successfully')
        } else {
            // Insert new
            const { error } = await supabase
                .from('carousel_slides')
                .insert({
                    title: form.title || null,
                    link: form.link || null,
                    display_order: form.display_order,
                    is_active: form.is_active,
                    image_url: form.image_url,
                })

            if (error) { setError(error.message); setSaving(false); return }
            setSuccess('Slide added successfully')
        }

        resetForm()
        fetchSlides()
        setSaving(false)
    }

    // ── Edit a slide ─────────────────────────────────────────────────────────
    function handleEdit(slide: Slide) {
        setEditingId(slide.id)
        setForm({
            title: slide.title ?? '',
            link: slide.link ?? '',
            display_order: slide.display_order,
            is_active: slide.is_active,
            image_url: slide.image_url,
        })
        setPreview(slide.image_url)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ── Delete ───────────────────────────────────────────────────────────────
    async function handleDelete(id: string) {
        if (!confirm('Delete this slide?')) return
        const { error } = await supabase
            .from('carousel_slides')
            .delete()
            .eq('id', id)

        if (error) { setError(error.message); return }
        setSlides(prev => prev.filter(s => s.id !== id))
        setSuccess('Slide deleted')
    }

    // ── Toggle active ────────────────────────────────────────────────────────
    async function handleToggleActive(slide: Slide) {
        const { error } = await supabase
            .from('carousel_slides')
            .update({ is_active: !slide.is_active })
            .eq('id', slide.id)

        if (error) { setError(error.message); return }
        setSlides(prev =>
            prev.map(s => s.id === slide.id ? { ...s, is_active: !s.is_active } : s)
        )
    }

    // ── Move order up / down ─────────────────────────────────────────────────
    async function handleMove(slide: Slide, direction: 'up' | 'down') {
        const index = slides.findIndex(s => s.id === slide.id)
        const swapIndex = direction === 'up' ? index - 1 : index + 1
        if (swapIndex < 0 || swapIndex >= slides.length) return

        const swapSlide = slides[swapIndex]

        // Swap display_order values
        await Promise.all([
            supabase.from('carousel_slides')
                .update({ display_order: swapSlide.display_order })
                .eq('id', slide.id),
            supabase.from('carousel_slides')
                .update({ display_order: slide.display_order })
                .eq('id', swapSlide.id),
        ])

        fetchSlides()
    }

    function resetForm() {
        setForm({ title: '', link: '', display_order: slides.length, is_active: true, image_url: '' })
        setPreview('')
        setEditingId(null)
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 text-gray-900">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-gray-900">
                    {editingId ? 'Edit slide' : 'Carousel Manager'}
                </h1>
                <p className="text-gray-500 mt-2 font-light italic uppercase tracking-widest text-[10px]">Manage your homepage hero carousel slides</p>
            </div>

            {/* Feedback Messages */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-accent text-sm animate-in fade-in slide-in-from-top-2">
                    {success}
                </div>
            )}

            {/* Form Section */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-medium tracking-widest uppercase text-gray-900">
                        {editingId ? 'Modify Slide Details' : 'Create New Slide'}
                    </h2>
                    {editingId && (
                        <button onClick={resetForm} className="text-xs text-gray-400 hover:text-gray-900 underline underline-offset-4 transition-colors">
                            Cancel Editing
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Image Preview / Upload Area */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Slide Image</label>
                        <div
                            className={cn(
                                "relative aspect-[16/6] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group transition-all duration-300",
                                preview && "border-solid border-accent/30",
                                uploading && "opacity-50"
                            )}
                        >
                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label className="cursor-pointer bg-white text-black px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            Replace Image
                                            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100/50 transition-colors">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 text-accent">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-bold tracking-widest uppercase">{uploading ? 'Processing...' : 'Upload Image'}</p>
                                    <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wide">Recommended: 1920×800px</p>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Meta Fields */}
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400 block">Slide Title (Optional)</label>
                            <input
                                className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-accent focus:outline-none transition-colors text-sm font-light tracking-wide text-gray-900"
                                value={form.title}
                                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                placeholder="e.g. OUD COLLECTION 2024"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400 block">Link URL (Optional)</label>
                            <input
                                className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-accent focus:outline-none transition-colors text-sm font-light tracking-wide text-gray-900"
                                value={form.link}
                                onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
                                placeholder="e.g. /products/oud-rose"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400 block">Order</label>
                                <input
                                    type="number"
                                    className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-accent focus:outline-none transition-colors text-sm font-light text-gray-900"
                                    value={form.display_order}
                                    onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="flex items-end pb-3">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-accent rounded border-gray-300"
                                        checked={form.is_active}
                                        onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                                    />
                                    <span className="text-xs font-bold tracking-widest uppercase group-hover:text-accent transition-colors text-gray-700">Visible</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={handleSave}
                                disabled={saving || uploading || !form.image_url}
                                className="w-full"
                            >
                                {saving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : editingId ? 'Update Slide' : 'Create Slide'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold tracking-widest uppercase text-gray-900">Current Slides ({slides.length})</h2>
                    <div className="h-[1px] flex-1 mx-6 bg-gray-100"></div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin h-6 w-6 border-2 border-accent border-t-transparent rounded-full"></div>
                    </div>
                ) : slides.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
                        <p className="text-gray-400 font-light text-sm uppercase tracking-widest">No slides found in the gallery</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={cn(
                                    "group bg-white border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 transition-all duration-300 hover:shadow-md hover:border-accent/20",
                                    editingId === slide.id && "border-accent ring-1 ring-accent/20 ring-offset-2"
                                )}
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full md:w-48 aspect-[16/7] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img src={slide.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className={cn(
                                        "absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase",
                                        slide.is_active ? "bg-accent text-black" : "bg-gray-200 text-gray-500"
                                    )}>
                                        {slide.is_active ? 'Active' : 'Hidden'}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium tracking-wide uppercase text-sm truncate text-gray-900">
                                        {slide.title || <span className="text-gray-400 italic normal-case">Untitled Slide</span>}
                                    </h3>
                                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <span className="text-accent font-bold">#{index + 1}</span> Position
                                        </span>
                                        {slide.link && (
                                            <span className="truncate max-w-[200px]">
                                                • {slide.link}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-2">
                                    {/* Move Controls */}
                                    <div className="flex flex-col gap-1 mr-4">
                                        <button
                                            onClick={() => handleMove(slide, 'up')}
                                            disabled={index === 0}
                                            className="p-1 text-gray-400 hover:text-accent disabled:opacity-20 transition-colors"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                <path d="m18 15-6-6-6 6" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleMove(slide, 'down')}
                                            disabled={index === slides.length - 1}
                                            className="p-1 text-gray-400 hover:text-accent disabled:opacity-20 transition-colors"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                <path d="m6 9 6 6 6-6" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(slide)}
                                            className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase border border-gray-200 rounded-full text-gray-700 hover:border-accent hover:text-accent transition-all"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(slide.id)}
                                            className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-red-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                                        >
                                            Remove
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(slide)}
                                            className="ml-2 w-10 h-6 rounded-full bg-gray-100 relative transition-colors p-1 flex items-center group/toggle"
                                        >
                                            <div className={cn(
                                                "w-4 h-4 rounded-full transition-all duration-300 transform",
                                                slide.is_active ? "translate-x-4 bg-accent" : "translate-x-0 bg-gray-400"
                                            )} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Live Preview Strip */}
            {slides.filter(s => s.is_active).length > 0 && (
                <div className="border-t border-gray-100 pt-10 text-gray-900">
                    <div className="mb-6">
                        <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400">Live Homepage Experience</h2>
                        <p className="text-xs text-gray-500 mt-1 lowercase italic">active slides will transition in this sequence</p>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-6 snap-x no-scrollbar">
                        {slides
                            .filter(s => s.is_active)
                            .map(slide => (
                                <div key={slide.id} className="flex-shrink-0 w-80 snap-start">
                                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden group shadow-lg">
                                        <img src={slide.image_url} alt="" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                                                {slide.title || 'Collection'}
                                            </h4>
                                            {slide.link && (
                                                <div className="w-6 h-[1px] bg-accent mt-2 group-hover:w-12 transition-all duration-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    )
}