import { NextResponse } from 'next/server'
import { sendMSG91OTP } from '@/lib/msg91'

export async function POST(request: Request) {
    try {
        const { phone } = await request.json()
        
        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
        }

        const result = await sendMSG91OTP(phone)
        
        if (result.type === 'success' || result.request_id) {
            return NextResponse.json({ success: true, message: 'OTP dispatched successfully' })
        } else {
            return NextResponse.json({ error: result.message || 'Invalid Flow ID or Template ID.' }, { status: 400 })
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
