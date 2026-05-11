import { NextResponse } from 'next/server'
import { verifyMessageCentralOTP } from '@/lib/messageCentral'
import { createAdminClient } from '@/lib/supabase/admin'
import { consumeOtpBinding } from '@/lib/auth/otp-store'
import { normalizeIndianPhone, isPersonName } from '@/lib/validators'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { isSafeInternalPath } from '@/lib/validators'

export async function POST(request: Request) {
    try {
        let body: any
        try {
            body = await request.json()
        } catch {
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
        }
        const { phone, otp, verificationId, mode, firstName, lastName } = body || {}

        if (!verificationId || typeof verificationId !== 'string' || !otp || typeof otp !== 'string' || otp.length > 10) {
            return NextResponse.json({ error: 'OTP and verification ID are required.' }, { status: 400 })
        }

        const submittedDigits = normalizeIndianPhone(phone)
        if (!submittedDigits) {
            return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })
        }

        // Rate-limit verify attempts per verificationId (prevent OTP brute-force) and per IP.
        const ip = getClientIp(request)
        const perId = await rateLimit({ key: `otp:verify:id:${verificationId}`, limit: 5, windowSec: 600 })
        if (!perId.ok) return rateLimitResponse(perId)
        const perIp = await rateLimit({ key: `otp:verify:ip:${ip}`, limit: 30, windowSec: 600 })
        if (!perIp.ok) return rateLimitResponse(perIp)

        // 1. Verify OTP with Message Central
        const mcResult = await verifyMessageCentralOTP(verificationId, otp)
        if (!mcResult.success) {
            return NextResponse.json({ error: 'Invalid or expired OTP.' }, { status: 400 })
        }

        // 2. Confirm the verificationId was the one we issued for THIS phone.
        //    consumeOtpBinding returns the phone we recorded at send-time and
        //    marks the binding as consumed (one-shot).
        const boundDigits = await consumeOtpBinding(verificationId)
        if (!boundDigits || boundDigits !== submittedDigits) {
            return NextResponse.json({ error: 'OTP could not be verified for this number.' }, { status: 400 })
        }

        const cleanPhone = `+91${submittedDigits}`

        // 3. Validate optional names
        let safeFirst: string | undefined
        let safeLast: string | undefined
        if (firstName !== undefined && firstName !== null && firstName !== '') {
            if (!isPersonName(firstName)) {
                return NextResponse.json({ error: 'Invalid first name.' }, { status: 400 })
            }
            safeFirst = firstName.trim()
        }
        if (lastName !== undefined && lastName !== null && lastName !== '') {
            if (!isPersonName(lastName)) {
                return NextResponse.json({ error: 'Invalid last name.' }, { status: 400 })
            }
            safeLast = lastName.trim()
        }

        const supabaseAdmin = createAdminClient()

        // 4. Find user by phone in profiles table (indexed) instead of listUsers (which caps at 1000)
        const { data: profileByPhone } = await supabaseAdmin
            .from('profiles')
            .select('id, first_name, full_name')
            .or(`phone.eq.${cleanPhone},phone.eq.${submittedDigits}`)
            .maybeSingle()

        let userId: string
        let userEmail: string
        let needsName = false

        if (profileByPhone?.id) {
            userId = profileByPhone.id
            const { data: { user: authUser } } = await supabaseAdmin.auth.admin.getUserById(userId)
            userEmail = authUser?.email || `${submittedDigits}@reveil.internal`
            needsName = !profileByPhone.first_name && !profileByPhone.full_name
        } else {
            const internalEmail = `${submittedDigits}@reveil.internal`
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                phone: cleanPhone,
                email: internalEmail,
                phone_confirm: true,
                email_confirm: true,
                user_metadata: safeFirst ? { first_name: safeFirst, last_name: safeLast ?? '' } : {},
            })
            if (createError) throw createError
            userId = newUser.user.id
            userEmail = newUser.user.email!

            await supabaseAdmin.from('profiles').upsert({
                id: userId,
                phone: cleanPhone,
                role: 'user',
                ...(safeFirst && { first_name: safeFirst, last_name: safeLast ?? '' }),
            }, { onConflict: 'id' })

            needsName = !safeFirst
        }

        // 5. Generate magic link with a validated redirect target
        const protocol = request.headers.get('x-forwarded-proto') || 'https'
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'perfumesreveil.vercel.app'
        const siteUrl = host.includes('localhost') ? `http://${host}` : `${protocol}://${host}`

        const requestedNext = typeof body?.next === 'string' ? body.next : '/orders'
        const safeNext = isSafeInternalPath(requestedNext) ? requestedNext : '/orders'
        const redirectTo = `${siteUrl}/auth/callback?next=${encodeURIComponent(safeNext)}`

        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: userEmail,
            options: { redirectTo },
        })

        if (linkError) throw linkError

        return NextResponse.json({
            success: true,
            loginUrl: linkData.properties.action_link,
            needs_name: mode === 'signup' ? needsName : false,
            user_id: userId,
        })

    } catch (error: any) {
        console.error('[OTP Verify] Error')
        return NextResponse.json({ error: 'Verification failed.' }, { status: 500 })
    }
}
