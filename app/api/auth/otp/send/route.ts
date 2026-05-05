import { NextResponse } from 'next/server'
import { sendMessageCentralOTP } from '@/lib/messageCentral'

export async function POST(request: Request) {
    try {
        const { phone } = await request.json()

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
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
