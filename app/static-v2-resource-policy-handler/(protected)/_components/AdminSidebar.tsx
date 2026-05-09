'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Tag,
    Layers,
    MessageSquare,
    Image as ImageIcon,
    Sparkles,
    TrendingUp,
    LogOut,
    ExternalLink
} from 'lucide-react'

const navItems = [
    { href: '/static-v2-resource-policy-handler', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/static-v2-resource-policy-handler/users', label: 'User Registry', icon: Users },
    { href: '/static-v2-resource-policy-handler/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/static-v2-resource-policy-handler/products', label: 'Products', icon: Tag },
    { href: '/static-v2-resource-policy-handler/categories', label: 'Categories', icon: Layers },
    { href: '/static-v2-resource-policy-handler/reviews', label: 'Reviews', icon: MessageSquare },
    { href: '/static-v2-resource-policy-handler/carousel', label: 'Carousel', icon: ImageIcon },
    { href: '/static-v2-resource-policy-handler/collections', label: 'Collections', icon: Sparkles },
    { href: '/static-v2-resource-policy-handler/trending', label: 'Trending', icon: TrendingUp },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-black border-r border-white/10 flex flex-col h-screen sticky top-0">
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#d4af37] rounded-lg flex items-center justify-center">
                        <span className="text-black font-black text-sm">R</span>
                    </div>
                    <span className="text-white font-bold tracking-widest uppercase text-sm">
                        Reveil Admin
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/static-v2-resource-policy-handler' && pathname.startsWith(item.href))
                    const Icon = item.icon
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                                isActive 
                                    ? "bg-white/10 text-[#d4af37]" 
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute left-0 w-1 h-6 bg-[#d4af37] rounded-r-full" />
                            )}
                            
                            <Icon className={cn(
                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                isActive ? "text-[#d4af37]" : "text-white/40 group-hover:text-white"
                            )} />
                            <span className="text-sm font-medium tracking-wide">
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-1">
                <Link
                    href="/"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors duration-300 group"
                >
                    <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    <span className="text-sm font-semibold uppercase tracking-widest">
                        Back to Site
                    </span>
                </Link>
                <form action="/api/auth/signout" method="post">
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors duration-300 group"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-semibold uppercase tracking-widest">
                            Logout
                        </span>
                    </button>
                </form>
            </div>
        </aside>
    )
}
