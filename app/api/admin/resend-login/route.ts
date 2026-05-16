import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendAdminCredentialsEmail } from '@/lib/utils/email'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Verify admin status
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, email')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Send credentials to the current admin's email
        await sendAdminCredentialsEmail(profile.email || 'reveilfragrances@gmail.com')

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('[Resend Login API Error]', err.message)
        return NextResponse.json({ error: 'Failed to resend credentials' }, { status: 500 })
    }
}
