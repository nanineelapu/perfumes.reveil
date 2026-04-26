'use client'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LayoutGrid, List, SlidersHorizontal, Filter, Plus, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/store/ProductCard'
import { Product } from '@/types/store'
import { createClient } from '@/lib/supabase/client'

const concentrations = ["Pure Parfum", "Extrait de Parfum", "Eau de Parfum", "Parfum Oil"]

export function ProductListContent() {
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get('search') || ""
    const initialCategory = searchParams.get('category') || "ALL"

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(initialCategory)
    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [sortBy, setSortBy] = useState("Featured")
    const [selectedConcentrations, setSelectedConcentrations] = useState<string[]>([])
    const [selectedStatus, setSelectedStatus] = useState<string[]>([])

    const supabase = createClient()

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setProducts(data || [])
            } catch (err) {
                console.error('Error fetching products:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()

        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const categories = ["ALL", "Perfumes", "DEODRANTS", "ATTARS", "AIRFRESHNER", "Reveil Fragrance"]

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(p => {
            const matchesCat = selectedCategory === "ALL" || p.category?.toUpperCase() === selectedCategory.toUpperCase()
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesConc = selectedConcentrations.length === 0 || (p.technical_specs?.concentration && selectedConcentrations.includes(p.technical_specs.concentration))

            let matchesStatus = true
            if (selectedStatus.length > 0) {
                matchesStatus = false
                if (selectedStatus.includes("In Stock") && p.stock > 0) matchesStatus = true
                if (selectedStatus.includes("Limited Edition") && p.category === "LIMITED") matchesStatus = true
                if (selectedStatus.includes("Archived") && p.stock === 0) matchesStatus = true
            }

            return matchesCat && matchesSearch && matchesConc && matchesStatus
        })

        switch (sortBy) {
            case "Price: Low to High":
                filtered.sort((a, b) => a.price - b.price)
                break
            case "Price: High to Low":
                filtered.sort((a, b) => b.price - a.price)
                break
            case "Featured":
            default:
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
                break
        }

        return filtered
    }, [selectedCategory, searchQuery, products, selectedConcentrations, selectedStatus, sortBy])

    return (
        <main style={{ background: '#050505', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
            <section style={{
                padding: isMobile ? '100px 0 20px' : '60px 0 40px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(to bottom, #0a0a0a, #050505)',
                borderBottom: '1px solid rgba(255,255,255,0.03)'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                    maskImage: 'linear-gradient(to bottom, black, transparent)'
                }} />

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 60px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        fontSize: '15vw', color: 'rgba(255,255,255,0.012)', fontWeight: 900,
                        pointerEvents: 'none', zIndex: 0, letterSpacing: '-0.05em'
                    }}>
                        02
                    </div>

                    <div style={{ 
                        display: 'flex', flexDirection: isMobile ? 'row' : 'column', 
                        alignItems: isMobile ? 'flex-end' : 'center', justifyContent: isMobile ? 'space-between' : 'center',
                        position: 'relative', zIndex: 1, width: '100%'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                            style={{ textAlign: isMobile ? 'left' : 'center', flex: isMobile ? '1' : 'none' }}
                        >
                            <h1 style={{ margin: 0, paddingBottom: isMobile ? '0' : '16px' }}>
                                <span style={{
                                    fontSize: isMobile ? '32px' : 'clamp(40px, 8vw, 80px)',
                                    fontWeight: 300, letterSpacing: '-0.04em', color: '#fff', lineHeight: 0.8, display: 'block'
                                }}>
                                    Re<span style={{ color: '#d4af37', fontWeight: 400 }}>veil</span>
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-end' : 'center', gap: '32px' }}
                        >
                            {!isMobile && <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.2)' }} />}
                            <span style={{
                                fontSize: isMobile ? '8px' : '11px', letterSpacing: isMobile ? '0.3em' : '1.4em',
                                color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginRight: isMobile ? '0' : '-1.4em', fontWeight: 500
                            }}>
                                Studio Archive
                            </span>
                            {!isMobile && <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.2)' }} />}
                        </motion.div>
                    </div>
                </div>
            </section>

            {isMobile && (
                <div style={{
                    position: 'sticky', top: '70px', zIndex: 50, background: 'rgba(5,5,5,0.95)',
                    backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    padding: '12px 0 16px', overflowX: 'auto', scrollbarWidth: 'none',
                    display: 'flex', gap: '24px', paddingLeft: '24px', paddingRight: '24px'
                }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                background: 'none', border: 'none', color: selectedCategory === cat ? '#d4af37' : '#444',
                                fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', whiteSpace: 'nowrap', transition: '0.3s', fontWeight: selectedCategory === cat ? 800 : 500
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
                <aside style={{
                    width: isMobile ? '0' : '380px', padding: isMobile ? '0' : '60px',
                    display: isMobile ? 'none' : 'flex', background: 'transparent', borderRight: '1px solid rgba(255,255,255,0.05)',
                    position: 'sticky', top: '80px', height: 'calc(100vh - 80px)', flexDirection: 'column', gap: '64px', overflowY: 'auto', scrollbarWidth: 'none', zIndex: 20
                }}>
                    <div>
                        <span style={{ fontSize: '10px', fontWeight: 900, color: '#d4af37', letterSpacing: '0.6em', textTransform: 'uppercase', marginBottom: '24px', display: 'block' }}>Scan Database</span>
                        <div style={{ position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                            <Search size={14} style={{ position: 'absolute', left: 0, top: '4px', opacity: 0.2 }} />
                            <input
                                type="text"
                                placeholder="IDENTIFY_OLFACTORY_FRAGMENT..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '12px', paddingLeft: '32px', width: '100%', outline: 'none', letterSpacing: '0.1em' }}
                            />
                        </div>
                    </div>

                    <div>
                        <span style={{ fontSize: '10px', fontWeight: 900, color: '#d4af37', letterSpacing: '0.6em', textTransform: 'uppercase', marginBottom: '32px', display: 'block' }}>Classification</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {categories.map((cat, idx) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', textAlign: 'left',
                                        color: selectedCategory === cat ? '#fff' : '#444', textTransform: 'uppercase', letterSpacing: '0.25em',
                                        display: 'flex', alignItems: 'center', transition: 'all 0.4s ease', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.02)'
                                    }}
                                >
                                    <span style={{ fontSize: '8px', opacity: 0.5, width: '40px', fontWeight: 800 }}>0{idx + 1}</span>
                                    <span style={{ position: 'relative', fontWeight: selectedCategory === cat ? 900 : 500, letterSpacing: selectedCategory === cat ? '0.4em' : '0.25em' }}>
                                        {cat}
                                        {selectedCategory === cat && (
                                            <motion.div layoutId="cat-underline" style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '1px', background: '#d4af37' }} />
                                        )}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '-20px' }}>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            style={{
                                width: '100%', background: 'transparent', border: '1px solid #222', padding: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.3s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <SlidersHorizontal size={14} color="#d4af37" />
                                <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Advanced Filters</span>
                            </div>
                            <Plus size={12} color="#444" />
                        </button>
                    </div>

                    <div>
                        <span style={{ fontSize: '9px', fontWeight: 900, color: '#d4af37', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '24px', display: 'block' }}>Refine by Density</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {concentrations.map(c => (
                                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontWeight: 800, letterSpacing: '0.05em' }}>
                                    <input
                                        type="checkbox"
                                        style={{ accentColor: '#d4af37' }}
                                        checked={selectedConcentrations.includes(c)}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedConcentrations([...selectedConcentrations, c])
                                            else setSelectedConcentrations(selectedConcentrations.filter(item => item !== c))
                                        }}
                                    />
                                    {c}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: '9px', color: '#555', lineHeight: 1.6, margin: 0, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                            All fragments curated in legal compliance with international olfactory standards.
                        </p>
                    </div>
                </aside>

                <section style={{ flex: 1, position: 'relative' }}>
                    <div style={{
                        position: 'sticky', top: isMobile ? '120px' : '80px', zIndex: 10,
                        padding: isMobile ? '20px 24px' : '40px 80px', background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div>
                            <span style={{ fontSize: isMobile ? '8px' : '10px', color: '#555', letterSpacing: '0.2em' }}>
                                {loading ? 'SCANNING ARCHIVE...' : `ARCHIVE: ${filteredAndSortedProducts.length} FRAGMENTS`}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {isMobile && (
                                <button onClick={() => setIsFilterOpen(true)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Filter size={14} color="#d4af37" />
                                    <span style={{ fontSize: '9px', color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Filter</span>
                                </button>
                            )}
                            {!isMobile && (
                                <>
                                    <LayoutGrid size={16} opacity={0.3} style={{ cursor: 'pointer' }} />
                                    <List size={16} opacity={0.3} style={{ cursor: 'pointer' }} />
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ padding: isMobile ? '24px 16px 80px' : '40px 80px 80px' }}>
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '160px 0', gap: '24px' }}
                                >
                                    <Loader2 className="animate-spin" size={32} color="#d4af37" />
                                    <span style={{ fontSize: '10px', color: '#d4af37', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Synchronizing Database</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={selectedCategory + sortBy + selectedStatus.join(',')}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(300px, 1fr))',
                                        gap: isMobile ? '24px 12px' : '64px 40px'
                                    }}
                                >
                                    {filteredAndSortedProducts.map((product, idx) => (
                                        <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!loading && filteredAndSortedProducts.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '160px 0', border: '1px dashed rgba(255,255,255,0.05)' }}>
                                <h3 style={{ fontSize: '14px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.4em' }}>No results match your current classification</h3>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 100 }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                             style={{
                                position: 'fixed', top: 0, right: 0, bottom: 0, 
                                width: isMobile ? '100%' : '450px',
                                background: '#0a0a0a', borderLeft: '1px solid #222', zIndex: 110,
                                padding: isMobile ? '40px 24px' : '80px 60px', 
                                boxShadow: '-20px 0 80px rgba(0,0,0,0.8)',
                                display: 'flex', flexDirection: 'column', gap: isMobile ? '40px' : '64px',
                                overflowY: 'auto'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#fff' }}>Archive Filters</h2>
                                <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Close</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                                <div>
                                    <label style={{ fontSize: '9px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '24px', display: 'block' }}>Sort Order</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {["Featured", "Price: High to Low", "Price: Low to High", "Newest"].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setSortBy(s)}
                                                style={{
                                                    background: 'none', border: 'none', textAlign: 'left',
                                                    color: sortBy === s ? '#fff' : '#444', fontSize: '13px',
                                                    cursor: 'pointer', transition: '0.3s'
                                                }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '9px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '24px', display: 'block' }}>Status</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {["In Stock", "Limited Edition", "Archived"].map(status => (
                                            <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    style={{ accentColor: '#d4af37' }}
                                                    checked={selectedStatus.includes(status)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedStatus([...selectedStatus, status])
                                                        else setSelectedStatus(selectedStatus.filter(s => s !== status))
                                                    }}
                                                />
                                                {status}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsFilterOpen(false)}
                                style={{
                                    marginTop: 'auto', background: '#fff', color: '#000', border: 'none',
                                    padding: '24px', fontWeight: 900, textTransform: 'uppercase',
                                    letterSpacing: '0.3em', fontSize: '10px', cursor: 'pointer'
                                }}
                            >
                                Apply Configuration
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    )
}
