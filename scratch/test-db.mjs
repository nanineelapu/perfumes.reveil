import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function test() {
    const { data, error } = await supabase
        .from('reviews')
        .select(`
            id,
            rating,
            comment,
            created_at,
            reviewer_name,
            reviewer_avatar,
            is_featured,
            product_id,
            products ( name ),
            profiles ( full_name )
        `)
        .limit(1)
    
    console.log('Error:', error)
    console.log('Data:', data)
}

test()
