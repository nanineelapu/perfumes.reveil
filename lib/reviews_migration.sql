-- 1. Add columns for manual and curated reviews
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS reviewer_name TEXT,
ADD COLUMN IF NOT EXISTS reviewer_avatar TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- 2. Create Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. (Optional) Link Products to Categories by ID
-- If you want to use formal IDs instead of names, run this:
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);

-- 4. Initial Categories (Optional - you can also add them via the Admin Panel)
-- INSERT INTO categories (name, slug, display_order) VALUES 
-- ('Perfumes', 'perfumes', 1),
-- ('DEODRANTS', 'deodrants', 2),
-- ('ATTARS', 'attars', 3),
-- ('AIRFRESHNER', 'airfreshner', 4),
-- ('Reveil Fragrance', 'reveil-fragrance', 5);
