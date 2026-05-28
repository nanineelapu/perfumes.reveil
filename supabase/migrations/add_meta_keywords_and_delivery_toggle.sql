-- Adds dynamic SEO keywords, per-product delivery toggle, and MRP (strikethrough price).
-- Apply against your Reveil Supabase project (Dashboard → SQL editor).

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS meta_keywords text,
  ADD COLUMN IF NOT EXISTS apply_delivery_fee boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS mrp numeric;

COMMENT ON COLUMN public.products.meta_keywords IS
  'Comma-separated SEO keywords. Merged with auto-generated keywordsForProduct() in the product page <meta name="keywords">.';

COMMENT ON COLUMN public.products.apply_delivery_fee IS
  'When false, this product never contributes to the cart shipping fee. Cart computes shipping only if at least one item has this flag = true.';

COMMENT ON COLUMN public.products.mrp IS
  'Original / Maximum Retail Price. When set and greater than price, the storefront renders it struck through next to the selling price. Leave NULL for no strikethrough.';
