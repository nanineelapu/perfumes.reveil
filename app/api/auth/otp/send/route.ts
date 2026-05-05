import { NextResponse } from 'next/server'
import { sendMessageCentralOTP } from '@/lib/messageCentral'

export async function POST(request: Request) {
    try {
        const body = await request.text()
        if (!body) {
            return NextResponse.json({ error: 'Request body is empty' }, { status: 400 })
        }

        let parsed: { phone?: string }
        try {
            parsed = JSON.parse(body)
        } catch {
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
        }

        const { phone } = parsed

        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
        }

        const result = await sendMessageCentralOTP(phone)

        if (result.success && result.verificationId) {
            return NextResponse.json({
                success: true,
                verificationId: result.verificationId,
                message: 'OTP sent successfully',
            })
        }

        return NextResponse.json(
            { error: result.message || 'Failed to send OTP. Please try again.' },
            { status: 400 }
        )
    } catch (error: any) {
        console.error('[OTP Send Route] Error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
