import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import CategoryFilter from '@/components/admin/CategoryFilter'
import PageHeader from '../_components/PageHeader'
import { Plus, Search, Tag } from 'lucide-react'

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
        <div className="space-y-10">
            <PageHeader
                title="Products"
                subtitle="Manage your fragrance catalogue."
            >
                <div className="flex items-center gap-3">
                    <CategoryFilter
                        categories={categories}
                        currentCategory={categoryFilter}
                    />
                    <Link href="/static-v2-resource-policy-handler/products/new">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-[#d4af37] transition-all duration-300">
                            <Plus className="w-4 h-4" />
                            Add Product
                        </button>
                    </Link>
                </div>
            </PageHeader>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/40 flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products…"
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100 bg-gray-50">
                                <th className="px-5 py-4">Image</th>
                                <th className="px-5 py-4">Name</th>
                                <th className="px-5 py-4">Price</th>
                                <th className="px-5 py-4">Stock</th>
                                <th className="px-5 py-4">Category</th>
                                <th className="px-5 py-4">Featured</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products?.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-5">
                                        {product.images?.[0] ? (
                                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-xs text-gray-300 border border-dashed border-gray-200">
                                                No image
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-5">
                                        <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                                        <div className="text-xs text-gray-400 mt-1 font-mono">REF: {product.id.slice(0, 8).toUpperCase()}</div>
                                    </td>
                                    <td className="px-5 py-5">
                                        <div className="text-sm font-semibold text-black">₹{product.price.toLocaleString()}</div>
                                    </td>
                                    <td className="px-5 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                product.stock < 5 ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                                            )} />
                                            <span className="text-sm font-semibold text-gray-800">
                                                {product.stock} <span className="text-gray-400 font-normal">in stock</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-700 capitalize">
                                            {product.category ?? 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5">
                                        {product.is_featured ? (
                                            <span className="inline-flex px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold border border-[#d4af37]/20">
                                                Featured
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">Standard</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-5">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                href={`/static-v2-resource-policy-handler/products/${product.id}/edit`}
                                                className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
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
                    <div className="py-24 text-center bg-gray-50">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Tag className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-base font-semibold text-gray-500">No products yet</p>
                        <Link href="/static-v2-resource-policy-handler/products/new" className="text-[#d4af37] text-sm font-semibold mt-3 inline-block hover:underline underline-offset-4">
                            + Add your first product
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
