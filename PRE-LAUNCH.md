# Pre-launch security tasks — what only you can do

The code changes for every Critical and High finding are now in. This file
lists everything that **cannot be fixed in code** — Supabase SQL, dashboard
toggles, third-party signups, env vars, and the policy pages you still need
to write. Go through this top-to-bottom before flipping DNS to production.

---

## 1. Supabase — run the migration SQL

1. Open Supabase Studio → SQL editor → New query.
2. Paste the contents of [supabase/security.sql](supabase/security.sql).
3. Run it. Re-running is safe (everything is idempotent).
4. After it succeeds, verify:
   - **Tables**: `otp_verifications` and `pending_orders` exist.
   - **Indexes**: `orders_payment_id_unique_idx` exists.
   - **Functions**: `finalise_paid_order`, `create_cod_order`, `is_admin` exist.
   - **RLS**: every customer-data table shows "RLS enabled" in the dashboard.
5. Promote your own user to admin:
   ```sql
   update public.profiles set role='admin' where id = '<your auth user id>';
   ```
   You can find the id under Authentication → Users.

## 2. Supabase — Storage bucket policies (`product-images`)

The new `/api/upload` route requires the caller to be admin AND the bucket
must enforce the same rule at the storage layer (defense in depth).

In Storage → `product-images` → Policies, replace any "Allow all" policies
with:

- **SELECT (public read)** — public can `select` from this bucket.
  ```
  bucket_id = 'product-images'
  ```
- **INSERT (admin only)** — only admins can upload:
  ```
  bucket_id = 'product-images' and public.is_admin()
  ```
- **UPDATE / DELETE (admin only)** — same expression.

## 3. Supabase — Auth settings

- **Disable email/password sign-in** if you don't need it: Authentication → Providers → Email → disable. Otherwise the `<phone>@reveil.internal` accounts created by the OTP flow could be password-reset and hijacked.
- **Enable MFA** for your admin user: Authentication → Users → your row → "Enroll factor". Set up TOTP at least.
- **PITR (point-in-time recovery)** backups: Database → Backups → enable PITR (paid plan).

## 4. Razorpay dashboard

- Generate a **webhook secret** and add the webhook:
  - URL: `https://<your-domain>/api/payment/razorpay/webhook`
  - Events: `payment.captured`, `payment.authorized` (at minimum).
  - Copy the secret into env as `RAZORPAY_WEBHOOK_SECRET` (see §6).
- In **Settings → Webhooks → Active events**, test the webhook from the dashboard once after deploy.

## 5. Cloudflare Turnstile (captcha)

The OTP-send, newsletter and contact routes call `verifyTurnstile()`. In
production, the secret being unset makes them fail closed (good), but the
client form must actually render the widget.

1. Sign up at https://www.cloudflare.com/products/turnstile/.
2. Create a site, copy the site key + secret key.
3. Set env vars (see §6):
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY=...`
   - `TURNSTILE_SECRET_KEY=...`
4. In your auth, newsletter and contact form components, drop in the
   Turnstile widget (`<div class="cf-turnstile" data-sitekey="...">`) and
   include the token in the POST body as `captchaToken`. Until then, the
   forms will get a "Captcha verification failed" error in production.

## 6. Upstash Redis (rate limiting)

The in-memory rate limiter only works on a single Node instance — Vercel
spawns many, so without Upstash the limits do not actually enforce across
the fleet.

1. Sign up at https://upstash.com → create a Redis database (Global region).
2. Copy the REST URL and REST TOKEN.
3. Set env vars (see §6):
   - `UPSTASH_REDIS_REST_URL=...`
   - `UPSTASH_REDIS_REST_TOKEN=...`

## 7. Message Central — daily SMS budget cap

Log into the MC dashboard and set a per-day SMS spend cap. Even with our
rate-limits, a determined attacker can still hit ~7 200 OTP sends/day per
random phone — set a hard ceiling that covers normal traffic plus a margin.

## 8. Vercel — environment variables

Set all of these in **Project → Settings → Environment Variables**
(Production + Preview). Items marked **(NEW)** must be added — the code
already references them.

Existing (verify present):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`
- `SHIPROCKET_PICKUP_NAME`, `SHIPROCKET_PICKUP_PINCODE`
- `MESSAGE_CENTRAL_CUSTOMER_ID`, `MESSAGE_CENTRAL_AUTH_TOKEN`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`

**(NEW)** must be added:
- `RAZORPAY_WEBHOOK_SECRET` — from Razorpay dashboard webhook
- `SHIPROCKET_WEBHOOK_TOKEN` — invent any long random string; configure it in Shiprocket panel under Settings → API → Webhook → Token. Webhook FAILS CLOSED if this is missing.
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

After setting, redeploy.

## 9. Vercel — preview deployments + source maps

- **Project → Settings → Deployment Protection → enable Standard Protection** so non-production preview URLs require login. Otherwise they expose staging.
- Production source maps are already disabled (`productionBrowserSourceMaps: false` in `next.config.ts`). Don't change that.

## 10. Public legal & policy pages (DPDPA, Razorpay KYC, customer trust)

These are required for Razorpay live KYC and DPDPA compliance. You need to
write the content yourself; minimum pages to create and link in the footer:

- `/privacy-policy` — name the data fiduciary (Trimurty Enterprises), the
  data categories collected (phone, name, address, payment ID, browsing),
  retention periods (orders 7 years for GST, profile until account deletion),
  rights of the data principal (access, correction, erasure, grievance),
  and the contact email of the **Grievance Officer**.
- `/refund-policy` and `/return-policy` — required for Razorpay KYC.
- `/terms` — basic T&Cs covering catalogue accuracy, COD eligibility,
  cancellations.
- `/shipping` (already exists — confirm it states delivery SLA).

Link all of these from the site footer and from the checkout page.

## 11. Auth form updates (frontend work I haven't done)

The auth page (`app/auth/page.tsx`) currently calls `/api/auth/firebase-sync`
to do the "is this number registered?" pre-check. That endpoint now returns
a generic success only — so the UI shouldn't show different copy for login
vs signup based on its response. Audit the auth page and:

- Stop branching UI on the firebase-sync response (treat it as a shape check).
- After `/api/auth/otp/send` succeeds, prompt for OTP regardless of "registered or not". The signup-vs-login distinction is now decided silently by `/api/auth/otp/verify` based on whether the number exists.
- Render the Turnstile widget and pass `captchaToken` to `/api/auth/otp/send`.

I can do this when you're ready — flag it.

## 12. Newsletter & contact form updates (frontend work)

Both forms must now include a Turnstile widget and pass `captchaToken` in
the POST body. Without that, production submissions will all fail with
"Captcha verification failed".

## 13. Razorpay checkout integration (frontend work)

Your Razorpay flow already calls `/api/payment/razorpay/create-order`
followed by `/api/payment/razorpay/verify`. **No change is required there**
— but the webhook is new. After deploy, watch the Razorpay dashboard
webhook activity to confirm `payment.captured` events reach you and return
200.

## 14. Final sanity tests before launch

Run these manually. Each should fail/succeed exactly as listed:

| Test | Expected |
| --- | --- |
| Hit `/static-v2-resource-policy-handler` as a normal customer | Redirect to `/` |
| Hit `PUT /api/products/<id>` as a normal customer | 403 |
| Hit `POST /api/upload` unauthenticated | 401 |
| Send OTP to phone A, then call `/api/auth/otp/verify` with phone B and A's verificationId | 400 "OTP could not be verified for this number" |
| Replay a `/api/payment/razorpay/verify` body twice | Second call returns idempotent or matched order id (no second order in DB) |
| POST to `/api/auth/otp/send` 6 times in 60s for the same phone | 429 after the first |
| POST `/api/newsletter/subscribe` 11 times in an hour from one IP | 429 |
| Hit `/api/delivery/status` without `x-api-key` | 401 |
| `curl -I https://<your-domain>/` | Headers include `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, no `x-powered-by` |
| Use Razorpay dashboard "Send test webhook" → confirm 200 in your logs | 200 |

---

If any of these fails, **do not launch**. Ping me with the failing test and
I'll dig in.
