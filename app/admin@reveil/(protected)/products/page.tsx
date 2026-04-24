import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import { Button } from '@/components/ui/button'

export default async function AdminProductsPage() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-6xl mx-auto space-y-8 text-gray-900">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-gray-900">
                        Product Gallery
                    </h1>
                    <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1 italic">
                        Manage your luxury collection inventory
                    </p>
                </div>
                <Link href="/admin@reveil/products/new">
                    <Button size="sm" className="px-8">
                        + New Fragrance
                    </Button>
                </Link>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden mt-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#fcfcfc] border-b border-gray-100">
                                {['Essence', 'Name', 'Price', 'Inventory', 'Group', 'Featured', 'Actions'].map((h) => (
                                    <th key={h} className="px-8 py-5 text-[10px] font-bold tracking-widest uppercase text-gray-400 whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products?.map((product) => (
                                <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                        {product.images?.[0] ? (
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 group-hover:border-accent/30 transition-colors">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-[9px] text-gray-300 uppercase tracking-tighter text-center px-1">
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="text-sm font-medium tracking-wide text-gray-900">{product.name}</div>
                                        <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">ID: {product.id.slice(0, 8).toUpperCase()}</div>
                                    </td>
                                    <td className="px-8 py-4 text-sm font-light text-gray-900">₹{product.price}</td>
                                    <td className="px-8 py-4">
                                        <span className={`text-[10px] font-bold tracking-widest uppercase ${product.stock < 5 ? 'text-red-400' : 'text-gray-900'}`}>
                                            {product.stock} <span className="text-[9px] font-light text-gray-400 ml-1">UNITS</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-[10px] font-bold tracking-widest uppercase text-gray-400">{product.category ?? 'Unset'}</td>
                                    <td className="px-8 py-4">
                                        {product.is_featured ? (
                                            <span className="text-accent text-[10px] font-bold tracking-widest uppercase shadow-sm px-2 py-0.5 border border-accent/20 rounded-full">Yes</span>
                                        ) : (
                                            <span className="text-gray-300 text-[10px] tracking-widest uppercase">—</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/admin@reveil/products/${product.id}/edit`}
                                                className="text-[10px] font-bold tracking-widest uppercase text-gray-700 hover:text-accent transition-colors underline underline-offset-4"
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
                    <div className="py-24 text-center">
                        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-gray-400">
                            No collections found in the vault
                        </p>
                        <Link href="/admin@reveil/products/new" className="text-accent text-xs font-bold tracking-widest uppercase mt-4 block hover:underline">
                            + Initialize your first fragrance
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
