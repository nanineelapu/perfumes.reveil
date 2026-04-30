'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PremiumLoader } from '@/components/store/PremiumLoader'

export default function AuthCallbackPage() {
    const router = useRouter()
    const supabase = createClient()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Supabase createBrowserClient automatically parses the hash fragment
                // (#access_token=...) and establishes the session in the background.
                // We just need to wait for it to be ready.
                
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) throw sessionError

                if (session) {
                    // Session established successfully!
                    router.replace('/orders')
                } else {
                    // Sometimes the parsing takes a tiny bit of time, or it's listening via onAuthStateChange
                    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
                        if (event === 'SIGNED_IN' && newSession) {
                            router.replace('/orders')
                        }
                    })

                    // Fallback timeout in case no session is found after 3 seconds
                    setTimeout(() => {
                        if (!error) {
                            supabase.auth.getSession().then(({ data }) => {
                                if (data.session) {
                                    router.replace('/orders')
                                } else {
                                    setError('Failed to establish session. Please try logging in again.')
                                }
                            })
                        }
                    }, 3000)

                    return () => {
                        subscription.unsubscribe()
                    }
                }
            } catch (err: any) {
                console.error('Callback error:', err)
                setError(err.message || 'Authentication failed')
            }
        }

        handleCallback()
    }, [router, supabase])

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#050505', color: '#fff', fontFamily: 'var(--font-baskerville)' }}>
                <p style={{ color: '#ff4b4b', marginBottom: '20px' }}>{error}</p>
                <button onClick={() => router.push('/auth')} style={{ background: '#d4af37', border: 'none', padding: '12px 32px', color: '#000', cursor: 'pointer', fontWeight: 'bold' }}>
                    Back to Login
                </button>
            </div>
        )
    }

    return <PremiumLoader iconName="sparkles" text="Securing your session..." />
}
