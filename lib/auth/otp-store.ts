import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Binding between a Message Central verificationId and the phone number
 * it was sent to. Without this, verifyOTP cannot tell whether the OTP
 * proves ownership of the phone in the request body, enabling account
 * takeover.
 *
 * Requires the `otp_verifications` table — see supabase/security.sql.
 */

export async function recordOtpSend(verificationId: string, phoneDigits: string) {
  const admin = createAdminClient()
  await admin.from('otp_verifications').insert({
    verification_id: verificationId,
    phone_digits: phoneDigits,
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  })
}

export async function consumeOtpBinding(verificationId: string): Promise<string | null> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('otp_verifications')
    .select('phone_digits, expires_at, consumed_at')
    .eq('verification_id', verificationId)
    .maybeSingle()
  if (!data) return null
  if (data.consumed_at) return null
  if (new Date(data.expires_at).getTime() < Date.now()) return null
  await admin
    .from('otp_verifications')
    .update({ consumed_at: new Date().toISOString() })
    .eq('verification_id', verificationId)
  return data.phone_digits as string
}
