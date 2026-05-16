import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { triggerOrderConfirmationEmail } from '@/lib/utils/email'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Verify admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { orderId } = body

        if (!orderId) {
            return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
        }

        await triggerOrderConfirmationEmail(orderId)

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('[Resend Confirmation API Error]', err.message)
        return NextResponse.json({ error: 'Failed to resend confirmation' }, { status: 500 })
    }
}
