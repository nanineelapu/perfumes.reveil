export function normalizeIndianPhone(input: unknown): string | null {
  if (typeof input !== 'string') return null
  let digits = input.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  if (digits.length !== 10) return null
  if (!/^[6-9]\d{9}$/.test(digits)) return null
  return digits
}

export function isEmail(input: unknown): input is string {
  if (typeof input !== 'string') return false
  if (input.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
}

// Internal email placeholder used purely as a Supabase `auth.users.email`
// identifier for phone-only signups (magic-link generation requires *some*
// email). These addresses must never be shown to users or treated as real
// contact addresses — see profiles.email for the real one.
export function isPlaceholderEmail(input: unknown): boolean {
  return typeof input === 'string' && /@reveil\.internal$/i.test(input)
}

// Returns the real, user-supplied email or null. Strips placeholders so
// the UI never accidentally displays "<phone>@reveil.internal".
export function realEmail(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const trimmed = input.trim()
  if (!trimmed) return null
  if (isPlaceholderEmail(trimmed)) return null
  return trimmed
}

export function clampString(input: unknown, max: number): string | null {
  if (typeof input !== 'string') return null
  const trimmed = input.trim()
  if (trimmed.length === 0 || trimmed.length > max) return null
  return trimmed
}

const NAME_RE = /^[\p{L}\p{M}\s'.-]+$/u
export function isPersonName(input: unknown): input is string {
  if (typeof input !== 'string') return false
  if (input.length < 1 || input.length > 50) return false
  return NAME_RE.test(input)
}

export function isUuid(input: unknown): input is string {
  return typeof input === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input)
}

export function clampInt(input: unknown, min: number, max: number): number | null {
  const n = typeof input === 'number' ? input : Number(input)
  if (!Number.isFinite(n)) return null
  const i = Math.trunc(n)
  if (i < min || i > max) return null
  return i
}

// Odisha PIN code ranges run from 751xxx (Bhubaneswar) through 770xxx
// (Mayurbhanj border). Reveil ships only within Odisha, so this prefix
// gate is the canonical deliverability check used by both the product
// page widget and the address/checkout save paths.
const ODISHA_PREFIX_MIN = 751
const ODISHA_PREFIX_MAX = 770

export function isIndianPincode(input: unknown): input is string {
  return typeof input === 'string' && /^[1-9][0-9]{5}$/.test(input)
}

export function isOdishaPincode(input: unknown): input is string {
  if (!isIndianPincode(input)) return false
  const prefix = parseInt(input.slice(0, 3), 10)
  return prefix >= ODISHA_PREFIX_MIN && prefix <= ODISHA_PREFIX_MAX
}

const SAFE_NEXT_RE = /^\/[a-zA-Z0-9._~!$&'()*+,;=:@%/-]*$/
export function isSafeInternalPath(input: unknown): input is string {
  if (typeof input !== 'string') return false
  if (input.length > 512) return false
  if (input.startsWith('//')) return false
  return SAFE_NEXT_RE.test(input)
}
