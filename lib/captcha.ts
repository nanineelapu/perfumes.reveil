/**
 * Cloudflare Turnstile verification.
 *
 * Set TURNSTILE_SECRET_KEY on the server and NEXT_PUBLIC_TURNSTILE_SITE_KEY
 * in the client. If TURNSTILE_SECRET_KEY is unset, verification is SKIPPED
 * (this lets local dev work) — make sure it is set in production.
 */

export async function verifyTurnstile(token: string | undefined, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[captcha] TURNSTILE_SECRET_KEY is not set in production — failing closed.')
      return false
    }
    return true
  }
  if (!token) return false
  try {
    const form = new URLSearchParams()
    form.append('secret', secret)
    form.append('response', token)
    if (remoteIp) form.append('remoteip', remoteIp)

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
      cache: 'no-store',
    })
    const data = (await res.json()) as { success?: boolean }
    return !!data.success
  } catch (err) {
    console.error('[captcha] verify error', err)
    return false
  }
}
