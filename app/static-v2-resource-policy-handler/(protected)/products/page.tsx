import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import { Button } from '@/components/ui/button'
import CategoryFilter from '@/components/admin/CategoryFilter'
import PageHeader from '../_components/PageHeader'
import { Plus, Search, Filter, Tag } from 'lucide-react'

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>
}) {
    const params = await searchParams
    const categoryFilter = params.category

    const supabase = await createClient()

    const [productsRes, categoriesRes] = await Promise.all([
        supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .filter('category', categoryFilter ? 'eq' : 'neq', categoryFilter || 'dummy_non_existent'),
        supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true })
    ])

    let products = productsRes.data
    if (!categoryFilter) {
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
        products = data
    }

    const categories = categoriesRes.data || []

    return (
        <div className="space-y-12">
            <PageHeader
                title="Product Gallery"
                subtitle="Manage and organize your luxury fragrance inventory."
            >
                <div className="flex items-center gap-4">
                    <CategoryFilter
                        categories={categories}
                        currentCategory={categoryFilter}
                    />
                    <Link href="/static-v2-resource-policy-handler/products/new">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-[#d4af37] transition-all duration-300">
                            <Plus className="w-4 h-4" />
                            New Fragrance
                        </button>
                    </Link>
                </div>
            </PageHeader>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-[#fcfcfc]/50 flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search collection..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 border-b border-gray-50 bg-gray-50/30">
                                <th className="px-8 py-5">Essence</th>
                                <th className="px-8 py-5">Collection Name</th>
                                <th className="px-8 py-5">Valuation</th>
                                <th className="px-8 py-5">Stock Level</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Featured</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products?.map((product) => (
                                <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        {product.images?.[0] ? (
                                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group-hover:border-[#d4af37]/30 transition-all duration-500">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[8px] text-gray-300 uppercase tracking-tighter text-center px-1 border border-dashed border-gray-200">
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors">{product.name}</div>
                                        <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">REF: {product.id.slice(0, 8)}</div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-medium text-black">₹{product.price.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                product.stock < 5 ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                                            )} />
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-700">
                                                {product.stock} <span className="text-gray-400 font-medium lowercase">units</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-[9px] font-bold tracking-widest uppercase text-gray-500">
                                            {product.category ?? 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {product.is_featured ? (
                                            <span className="text-[#d4af37] text-[9px] font-bold tracking-widest uppercase px-3 py-1 bg-[#d4af37]/10 rounded-full border border-[#d4af37]/20">
                                                Featured
                                            </span>
                                        ) : (
                                            <span className="text-gray-300 text-[9px] tracking-widest uppercase">Standard</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-4">
                                            <Link
                                                href={`/static-v2-resource-policy-handler/products/${product.id}/edit`}
                                                className="text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <DeleteProductButton id={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(!products || products.length === 0) && (
                    <div className="py-32 text-center bg-gray-50/30">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Tag className="w-6 h-6 text-gray-200" />
                        </div>
                        <p className="text-sm font-light tracking-wide text-gray-400">
                            No collections found in the system.
                        </p>
                        <Link href="/static-v2-resource-policy-handler/products/new" className="text-[#d4af37] text-[10px] font-bold tracking-widest uppercase mt-6 inline-block hover:underline underline-offset-8">
                            + Initialize your first fragrance
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

