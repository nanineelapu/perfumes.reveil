import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/admin/login')

    // TEMPORARILY DISABLED ROLE CHECK TO RESTORE ACCESS
    /*
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') redirect('/')
    */

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '220px', background: '#000', color: '#fff',
                padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px', padding: '0 8px' }}>
                    Admin Panel
                </div>
                {[
                    { href: '/admin', label: 'Dashboard' },
                    { href: '/admin/products', label: 'Products' },
                    { href: '/admin/orders', label: 'Orders' },
                    { href: '/admin/carousel', label: 'Carousel' },
                    { href: '/admin/collections', label: 'Collections' },
                    { href: '/admin/trending', label: 'Trending' },
                ].map(({ href, label }) => (
                    <Link key={href} href={href} style={{
                        padding: '10px 12px', borderRadius: '8px', color: '#ccc',
                        textDecoration: 'none', fontSize: '14px'
                    }}>
                        {label}
                    </Link>
                ))}
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: '32px', background: '#f9f9f9' }}>
                {children}
            </main>
        </div>
    )
}