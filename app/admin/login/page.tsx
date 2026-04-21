'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        router.push('/admin')
        router.refresh()
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleLogin} style={{
                background: '#fff', padding: '40px', borderRadius: '12px',
                width: '360px', display: 'flex', flexDirection: 'column', gap: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
                <h1 style={{ margin: 0, fontSize: '22px' }}>Admin login</h1>
                {error && <p style={{ color: 'red', margin: 0, fontSize: '14px' }}>{error}</p>}
                <input
                    type="email" placeholder="Email" value={email}
                    onChange={e => setEmail(e.target.value)} required
                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                />
                <input
                    type="password" placeholder="Password" value={password}
                    onChange={e => setPassword(e.target.value)} required
                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                />
                <button type="submit" disabled={loading} style={{
                    padding: '12px', background: '#1a1a2e', color: '#fff',
                    border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer'
                }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}