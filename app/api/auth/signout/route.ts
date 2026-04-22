import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
    const supabase = await createClient()

    // 1. Check if user exists
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
    }

    // 2. Redirect to landing page
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), {
        status: 302,
    })
}
