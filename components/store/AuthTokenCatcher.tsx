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
                        
                        // Clean up the URL and refresh the page to update all components
                        window.location.hash = ''
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
