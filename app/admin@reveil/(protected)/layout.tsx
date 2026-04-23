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

    if (!user) redirect('/admin@reveil/login')

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
                    { href: '/admin@reveil', label: 'Dashboard' },
                    { href: '/admin@reveil/users', label: 'User Registry' },
                    { href: '/admin@reveil/products', label: 'Products' },
                    { href: '/admin@reveil/orders', label: 'Orders' },
                    { href: '/admin@reveil/carousel', label: 'Carousel' },
                    { href: '/admin@reveil/collections', label: 'Collections' },
                    { href: '/admin@reveil/trending', label: 'Trending' },
                ].map(({ href, label }) => (
                    <Link key={href} href={href} style={{
                        padding: '10px 12px', borderRadius: '8px', color: '#ccc',
                        textDecoration: 'none', fontSize: '14px'
                    }}>
                        {label}
                    </Link>
                ))}

                <div style={{ marginTop: 'auto', padding: '16px 8px' }}>
                    <form action="/api/auth/signout" method="post">
                        <button type="submit" style={{
                            width: '100%', padding: '10px', borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)', color: '#ff4d4d',
                            border: '1px solid rgba(255,77,77,0.2)', cursor: 'pointer',
                            fontSize: '12px', fontWeight: 600, textAlign: 'left'
                        }}>
                            Logout Session
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: '32px', background: '#f9f9f9' }}>
                {children}
            </main>
        </div>
    )
}