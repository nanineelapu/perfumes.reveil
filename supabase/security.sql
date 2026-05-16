-- ============================================================================
-- REVEIL Perfumes — pre-launch security migration
--
-- Run this entire file in the Supabase SQL editor BEFORE you go live.
-- It is split into clearly-labelled sections. Each section is idempotent;
-- you can re-run the whole file safely.
--
-- Sections:
--   1. New tables required by the new server code (otp_verifications, pending_orders)
--   2. orders.payment_id uniqueness + helpful indexes
--   3. Postgres RPC functions for atomic order creation:
--        - finalise_paid_order  (used by /api/payment/razorpay/verify and the webhook)
--        - create_cod_order     (used by /api/orders POST)
--   4. RLS — enable on every customer-data table + policies
--   5. RLS policies for newsletter_subscribers, contact_inquiries (anon insert)
-- ============================================================================


-- ────────────────────────────────────────────────────────────────────────────
-- 1. NEW TABLES
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.otp_verifications (
    verification_id text primary key,
    phone_digits    text not null,
    created_at      timestamptz not null default now(),
    expires_at      timestamptz not null,
    consumed_at     timestamptz
);
create index if not exists otp_verifications_phone_idx on public.otp_verifications (phone_digits);
create index if not exists otp_verifications_expires_idx on public.otp_verifications (expires_at);

-- House-keep: drop rows older than 24h (run periodically via a cron job; or you
-- can leave them — the routes ignore expired/consumed rows anyway).
-- Suggested cron: 0 3 * * *  delete from otp_verifications where expires_at < now() - interval '1 day';


create table if not exists public.pending_orders (
    razorpay_order_id       text primary key,
    user_id                 uuid not null references auth.users(id) on delete cascade,
    address_id              uuid not null,
    buy_now_product_id      uuid,
    buy_now_quantity        integer,
    line_items              jsonb not null,
    subtotal                numeric(12,2) not null,
    shipping_fee            numeric(12,2) not null,
    total                   numeric(12,2) not null,
    expected_amount_paise   bigint  not null,
    currency                text    not null default 'INR',
    status                  text    not null default 'created' check (status in ('created','fulfilled','failed')),
    created_at              timestamptz not null default now(),
    fulfilled_at            timestamptz,
    fulfilled_order_id      uuid
);
create index if not exists pending_orders_user_idx on public.pending_orders (user_id);
create index if not exists pending_orders_status_idx on public.pending_orders (status);


-- Update reviews table with heading and media support
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='reviews' and column_name='heading') then
    alter table public.reviews add column heading text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='reviews' and column_name='media_urls') then
    alter table public.reviews add column media_urls text[] default '{}';
  end if;
end$$;


-- ────────────────────────────────────────────────────────────────────────────
-- 2. ORDERS — uniqueness + indexes
-- ────────────────────────────────────────────────────────────────────────────

-- Make razorpay payment_id one-shot: prevents replaying a verify call to
-- produce a second order from the same payment.
do $$
begin
  if not exists (
    select 1 from pg_indexes where schemaname='public' and indexname='orders_payment_id_unique_idx'
  ) then
    create unique index orders_payment_id_unique_idx
      on public.orders (payment_id)
      where payment_id is not null;
  end if;
end$$;

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_awb_code_idx on public.orders (awb_code) where awb_code is not null;
create index if not exists profiles_phone_idx on public.profiles (phone);

-- profiles.email is the *real*, user-supplied contact email. It is intentionally
-- separate from auth.users.email (which may hold a synthetic "<phone>@reveil.internal"
-- placeholder used only as a Supabase login identifier for phone-OTP signups).
-- Frontend & admin surfaces read from this column so the placeholder is never shown.
alter table public.profiles add column if not exists email text;
create index if not exists profiles_email_idx on public.profiles ((lower(email))) where email is not null;


-- ────────────────────────────────────────────────────────────────────────────
-- 3. RPC FUNCTIONS
-- ────────────────────────────────────────────────────────────────────────────

-- finalise_paid_order
--   Atomically:
--     a. Locks the pending_orders row (row-level lock).
--     b. Inserts orders + order_items.
--     c. Decrements stock for each product with WHERE stock >= qty (no oversell).
--     d. Marks pending_orders as fulfilled.
--   Returns the new orders.id.
--
-- Idempotency is already handled in lib/orders.ts by checking
-- orders.payment_id BEFORE calling this RPC; the unique index also enforces it.
create or replace function public.finalise_paid_order(
    p_razorpay_order_id   text,
    p_razorpay_payment_id text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_pending pending_orders%rowtype;
    v_order_id uuid;
    v_item jsonb;
    v_product_id uuid;
    v_qty integer;
    v_updated_rows integer;
    v_shipping_addr jsonb;
begin
    -- 1. Lock the pending row
    select * into v_pending
    from pending_orders
    where razorpay_order_id = p_razorpay_order_id
    for update;

    if not found then
        raise exception 'PENDING_NOT_FOUND';
    end if;

    if v_pending.status = 'fulfilled' then
        raise exception 'PENDING_ALREADY_FULFILLED';
    end if;

    -- 2. Build a frozen shipping_address snapshot from the address row.
    select jsonb_build_object(
        'label', a.label,
        'full_name', a.full_name,
        'phone', a.phone,
        'address_line1', a.address_line1,
        'address_line2', a.address_line2,
        'city', a.city,
        'state', a.state,
        'pincode', a.pincode
    ) into v_shipping_addr
    from addresses a
    where a.id = v_pending.address_id and a.user_id = v_pending.user_id;

    if v_shipping_addr is null then
        raise exception 'ADDRESS_NOT_FOUND';
    end if;

    -- 3. Insert order
    insert into orders (
        user_id, total, status, payment_method, payment_status, payment_id, shipping_address
    ) values (
        v_pending.user_id,
        v_pending.total,
        'confirmed',
        'razorpay',
        'paid',
        p_razorpay_payment_id,
        v_shipping_addr
    )
    returning id into v_order_id;

    -- 4. Insert order_items and decrement stock atomically per item.
    for v_item in select * from jsonb_array_elements(v_pending.line_items)
    loop
        v_product_id := (v_item->>'product_id')::uuid;
        v_qty        := (v_item->>'quantity')::int;

        update products
        set stock = stock - v_qty
        where id = v_product_id and stock >= v_qty;

        get diagnostics v_updated_rows = row_count;
        if v_updated_rows = 0 then
            raise exception 'OUT_OF_STOCK:%', v_product_id;
        end if;

        insert into order_items (order_id, product_id, quantity, price)
        values (
            v_order_id,
            v_product_id,
            v_qty,
            (v_item->>'price')::numeric
        );
    end loop;

    -- 5. Mark fulfilled
    update pending_orders
    set status = 'fulfilled',
        fulfilled_at = now(),
        fulfilled_order_id = v_order_id
    where razorpay_order_id = p_razorpay_order_id;

    return v_order_id;
end;
$$;

revoke all on function public.finalise_paid_order(text, text) from public, anon, authenticated;
grant execute on function public.finalise_paid_order(text, text) to service_role;


-- create_cod_order
--   Atomically inserts a COD order + items + decrements stock.
create or replace function public.create_cod_order(
    p_user_id          uuid,
    p_shipping_address jsonb,
    p_items            jsonb,           -- array of {product_id, quantity}
    p_total            numeric
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_order_id uuid;
    v_item jsonb;
    v_product products%rowtype;
    v_qty integer;
    v_updated_rows integer;
begin
    -- Insert pending COD order
    insert into orders (
        user_id, total, status, payment_method, payment_status, shipping_address
    ) values (
        p_user_id, p_total, 'pending', 'cod', 'pending', p_shipping_address
    )
    returning id into v_order_id;

    for v_item in select * from jsonb_array_elements(p_items)
    loop
        v_qty := (v_item->>'quantity')::int;

        select * into v_product
        from products
        where id = (v_item->>'product_id')::uuid
        for update;

        if not found then
            raise exception 'PRODUCT_NOT_FOUND:%', v_item->>'product_id';
        end if;

        update products
        set stock = stock - v_qty
        where id = v_product.id and stock >= v_qty;

        get diagnostics v_updated_rows = row_count;
        if v_updated_rows = 0 then
            raise exception 'OUT_OF_STOCK:%', v_product.id;
        end if;

        insert into order_items (order_id, product_id, quantity, price)
        values (v_order_id, v_product.id, v_qty, v_product.price);
    end loop;

    return v_order_id;
end;
$$;

revoke all on function public.create_cod_order(uuid, jsonb, jsonb, numeric) from public, anon, authenticated;
grant execute on function public.create_cod_order(uuid, jsonb, jsonb, numeric) to service_role;


-- ────────────────────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY
--
-- Enable RLS on every customer-data table and add owner-only policies.
-- The service_role bypasses RLS automatically — it is used only by trusted
-- server code (admin endpoints + payment finaliser).
--
-- IMPORTANT: review each policy against your existing data before launching.
-- If you already have looser policies, DROP them — these are the ones that
-- match the route handlers.
-- ────────────────────────────────────────────────────────────────────────────

-- helper to check if the current jwt is an admin profile
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
    select exists (
        select 1 from profiles where id = auth.uid() and role = 'admin'
    );
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- ----- profiles -----
alter table public.profiles enable row level security;

drop policy if exists "profiles self read"  on public.profiles;
drop policy if exists "profiles self write" on public.profiles;
drop policy if exists "profiles admin all"  on public.profiles;

create policy "profiles self read"  on public.profiles
    for select using (auth.uid() = id);
create policy "profiles self write" on public.profiles
    for update using (auth.uid() = id)
    with check (auth.uid() = id and role = 'user');  -- prevent self-promotion
create policy "profiles admin all" on public.profiles
    for all using (public.is_admin()) with check (true);

-- ----- orders -----
alter table public.orders enable row level security;

drop policy if exists "orders owner read"   on public.orders;
drop policy if exists "orders admin all"    on public.orders;

create policy "orders owner read" on public.orders
    for select using (auth.uid() = user_id);
create policy "orders admin all" on public.orders
    for all using (public.is_admin()) with check (true);

-- ----- order_items -----
alter table public.order_items enable row level security;

drop policy if exists "order_items owner read" on public.order_items;
drop policy if exists "order_items admin all"  on public.order_items;

create policy "order_items owner read" on public.order_items
    for select using (
        exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
    );
create policy "order_items admin all" on public.order_items
    for all using (public.is_admin()) with check (true);

-- ----- addresses -----
alter table public.addresses enable row level security;

drop policy if exists "addresses owner all" on public.addresses;
drop policy if exists "addresses admin all" on public.addresses;

create policy "addresses owner all" on public.addresses
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "addresses admin all" on public.addresses
    for all using (public.is_admin()) with check (true);

-- ----- cart_items -----
alter table public.cart_items enable row level security;

drop policy if exists "cart owner all" on public.cart_items;

create policy "cart owner all" on public.cart_items
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----- wishlists -----
alter table public.wishlists enable row level security;

drop policy if exists "wishlists owner all" on public.wishlists;

create policy "wishlists owner all" on public.wishlists
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----- reviews -----
alter table public.reviews enable row level security;

drop policy if exists "reviews public read"  on public.reviews;
drop policy if exists "reviews owner write"  on public.reviews;
drop policy if exists "reviews owner update" on public.reviews;
drop policy if exists "reviews admin all"    on public.reviews;

create policy "reviews public read" on public.reviews
    for select using (true);
create policy "reviews owner write" on public.reviews
    for insert with check (auth.uid() = user_id);
create policy "reviews owner update" on public.reviews
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews admin all" on public.reviews
    for all using (public.is_admin()) with check (true);

-- ----- products -----
alter table public.products enable row level security;

drop policy if exists "products public read" on public.products;
drop policy if exists "products admin write" on public.products;

create policy "products public read" on public.products
    for select using (true);
create policy "products admin write" on public.products
    for all using (public.is_admin()) with check (public.is_admin());

-- ----- categories / editorial_collections / homepage_curation / carousel_slides / trending -----
do $$
declare t text;
begin
  foreach t in array array['categories','editorial_collections','homepage_curation','carousel_slides','trending']
  loop
    if exists (select 1 from information_schema.tables where table_schema='public' and table_name=t) then
      execute format('alter table public.%I enable row level security;', t);
      execute format('drop policy if exists "%I public read" on public.%I;', t, t);
      execute format('drop policy if exists "%I admin write" on public.%I;', t, t);
      execute format('create policy "%I public read" on public.%I for select using (true);', t, t);
      execute format('create policy "%I admin write" on public.%I for all using (public.is_admin()) with check (public.is_admin());', t, t);
    end if;
  end loop;
end$$;

-- ----- newsletter_subscribers (anon insert allowed; admin can read) -----
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter anon insert" on public.newsletter_subscribers;
drop policy if exists "newsletter admin read"  on public.newsletter_subscribers;

create policy "newsletter anon insert" on public.newsletter_subscribers
    for insert with check (true);
create policy "newsletter admin read" on public.newsletter_subscribers
    for select using (public.is_admin());

-- Prevent duplicate emails (used by our 23505 silent-success behaviour).
do $$
begin
  if not exists (select 1 from pg_indexes where indexname = 'newsletter_subscribers_email_unique') then
    create unique index newsletter_subscribers_email_unique
      on public.newsletter_subscribers ((lower(email)));
  end if;
end$$;

-- ----- contact_inquiries (anon insert allowed; admin can read) -----
alter table public.contact_inquiries enable row level security;

drop policy if exists "contact anon insert" on public.contact_inquiries;
drop policy if exists "contact admin read"  on public.contact_inquiries;

create policy "contact anon insert" on public.contact_inquiries
    for insert with check (true);
create policy "contact admin read" on public.contact_inquiries
    for select using (public.is_admin());

-- ----- otp_verifications + pending_orders -----
--    No anon/authenticated access. Service role only.
alter table public.otp_verifications enable row level security;
alter table public.pending_orders     enable row level security;

-- ============================================================================
-- DONE.
--
-- After running this:
--   1. Verify in Authentication → Policies that every table shows RLS enabled.
--   2. Promote your admin user to role='admin':
--        update public.profiles set role='admin' where id = '<your-admin-user-id>';
--   3. Configure storage bucket policies for `product-images`:
--        - Public READ (you serve images publicly).
--        - INSERT restricted to admin role only (use auth.uid() and profiles.role).
--        Example policy in the Storage UI:
--           name:   "admin-upload"
--           role:   authenticated
--           policy: bucket_id = 'product-images' AND public.is_admin()
-- ============================================================================
