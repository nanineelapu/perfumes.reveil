import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    // 1. Check if user exists
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
    }

    // 2. Redirect to landing page on the same host the request came in on
    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
    return NextResponse.redirect(new URL('/', origin), {
        status: 302,
    })
}
