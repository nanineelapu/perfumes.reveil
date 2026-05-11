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

const SAFE_NEXT_RE = /^\/[a-zA-Z0-9._~!$&'()*+,;=:@%/-]*$/
export function isSafeInternalPath(input: unknown): input is string {
  if (typeof input !== 'string') return false
  if (input.length > 512) return false
  if (input.startsWith('//')) return false
  return SAFE_NEXT_RE.test(input)
}
