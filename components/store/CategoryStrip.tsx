// Component to display product categories in a horizontal strip
import Link from 'next/link'

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
    shoes: { label: 'Shoes', icon: '👟', color: '#ede9fe' },
    clothing: { label: 'Clothing', icon: '👕', color: '#dbeafe' },
    accessories: { label: 'Accessories', icon: '⌚', color: '#fef3c7' },
    bags: { label: 'Bags', icon: '👜', color: '#fce7f3' },
    sports: { label: 'Sports', icon: '⚽', color: '#dcfce7' },
}

export default function CategoryStrip({ categories }: { categories: string[] }) {
    if (categories.length === 0) return null

    return (
        <section style={{
            background: '#fff', padding: '32px 24px',
            borderBottom: '1px solid #f0f0f0'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{
                    textAlign: 'center', margin: '0 0 24px',
                    fontSize: '20px', fontWeight: 600, color: '#333'
                }}>
                    Shop by category
                </h2>
                <div style={{
                    display: 'flex', gap: '16px',
                    justifyContent: 'center', flexWrap: 'wrap',
                }}>
                    {/* All products */}
                    <Link href="/products" style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            gap: '10px', padding: '20px 28px', borderRadius: '12px',
                            background: '#f1f0fe', border: '2px solid transparent',
                            cursor: 'pointer', minWidth: '100px', transition: 'all 0.2s',
                        }}>
                            <span style={{ fontSize: '32px' }}>🛍️</span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#4338ca' }}>
                                All
                            </span>
                        </div>
                    </Link>

                    {categories.map(cat => {
                        const config = CATEGORY_CONFIG[cat] ?? {
                            label: cat.charAt(0).toUpperCase() + cat.slice(1),
                            icon: '📦',
                            color: '#f3f4f6',
                        }
                        return (
                            <Link
                                key={cat}
                                href={`/products?category=${cat}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    gap: '10px', padding: '20px 28px', borderRadius: '12px',
                                    background: config.color, border: '2px solid transparent',
                                    cursor: 'pointer', minWidth: '100px', transition: 'all 0.2s',
                                }}>
                                    <span style={{ fontSize: '32px' }}>{config.icon}</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                                        {config.label}
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}