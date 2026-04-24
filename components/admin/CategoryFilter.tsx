'use client'
import { useRouter } from 'next/navigation'

interface Category {
    id: string
    name: string
}

export default function CategoryFilter({ 
    categories, 
    currentCategory 
}: { 
    categories: Category[], 
    currentCategory?: string 
}) {
    const router = useRouter()

    return (
        <form method="GET" className="flex items-center gap-2">
            <select 
                name="category" 
                defaultValue={currentCategory || ''}
                onChange={(e) => {
                    const val = e.target.value
                    if (val) {
                        router.push(`/admin@reveil/products?category=${val}`)
                    } else {
                        router.push('/admin@reveil/products')
                    }
                }}
                className="text-[10px] font-bold tracking-widest uppercase border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-accent transition-colors bg-white cursor-pointer"
            >
                <option value="">All Categories</option>
                {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                ))}
            </select>
        </form>
    )
}
