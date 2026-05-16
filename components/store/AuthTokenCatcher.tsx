'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthTokenCatcher() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const hash = window.location.hash
        if (hash && (hash.includes('access_token=') || hash.includes('refresh_token='))) {
            const handleHash = async () => {
                try {
                    console.log('AuthTokenCatcher: Found hash, establishing session...')
                    const params = new URLSearchParams(hash.substring(1))
                    const access_token = params.get('access_token')
                    const refresh_token = params.get('refresh_token')

                    if (access_token && refresh_token) {
                        const { error } = await supabase.auth.setSession({
                            access_token,
                            refresh_token,
                        })
                        if (error) throw error

                        // Clean up the URL — replaceState avoids leaving tokens
                        // in the back/forward history.
                        if (window.history.replaceState) {
                            window.history.replaceState(null, '', window.location.pathname + window.location.search)
                        } else {
                            window.location.hash = ''
                        }

                        // If signup left a pending profile in sessionStorage
                        // (because the magic link hadn't been visited yet),
                        // finish the save now that we have a real session.
                        try {
                            const raw = sessionStorage.getItem('reveil_pending_profile')
                            if (raw) {
                                const pending = JSON.parse(raw)
                                // Only honor entries from the last 10 minutes
                                if (pending?.ts && Date.now() - pending.ts < 10 * 60 * 1000) {
                                    await fetch('/api/auth/save-profile', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            first_name: pending.first_name,
                                            last_name: pending.last_name,
                                            phone: pending.phone,
                                        }),
                                    }).catch((err) => console.error('AuthTokenCatcher: profile save failed', err))
                                }
                                sessionStorage.removeItem('reveil_pending_profile')
                            }
                        } catch (err) {
                            console.error('AuthTokenCatcher: pending-profile drain failed', err)
                        }

                        router.refresh()
                        console.log('AuthTokenCatcher: Session secured.')
                    }
                } catch (err) {
                    console.error('AuthTokenCatcher Error:', err)
                }
            }
            handleHash()
        }
    }, [router, supabase])

    return null
}
