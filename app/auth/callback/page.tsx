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
                // 1. Check if session is already established (e.g. by automatic background parsing)
                const { data: { session: existingSession } } = await supabase.auth.getSession()
                if (existingSession) {
                    router.replace('/orders')
                    return
                }

                // 2. Fallback: Manually parse tokens from hash if Supabase SDK is taking too long
                // This is critical for mobile browsers where the hash fragment might not be 
                // immediately picked up by the SDK's internal listeners.
                const hash = window.location.hash
                if (hash && (hash.includes('access_token=') || hash.includes('refresh_token='))) {
                    const params = new URLSearchParams(hash.substring(1))
                    const access_token = params.get('access_token')
                    const refresh_token = params.get('refresh_token')

                    if (access_token && refresh_token) {
                        const { data: { session: newSession }, error: setSessionError } = await supabase.auth.setSession({
                            access_token,
                            refresh_token,
                        })
                        if (setSessionError) throw setSessionError
                        if (newSession) {
                            router.replace('/orders')
                            return
                        }
                    }
                }

                // 3. Listen for the SIGNED_IN event (this is what the SDK usually triggers)
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
                    if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && newSession) {
                        router.replace('/orders')
                    }
                })

                // 4. Final Fallback: If nothing happens after 5 seconds, try one last check
                const timeout = setTimeout(async () => {
                    const { data: { session: finalCheck } } = await supabase.auth.getSession()
                    if (finalCheck) {
                        router.replace('/orders')
                    } else {
                        setError('We couldn\'t establish your session. This might happen if the link is expired or used already.')
                    }
                }, 5000)

                return () => {
                    subscription.unsubscribe()
                    clearTimeout(timeout)
                }
            } catch (err: any) {
                console.error('Callback error:', err)
                setError(err.message || 'Authentication failed. Please try again.')
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
