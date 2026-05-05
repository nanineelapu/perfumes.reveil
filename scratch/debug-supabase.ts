
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Basic env loader
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8')
        content.split('\n').forEach(line => {
            const [key, ...value] = line.split('=')
            if (key && value) {
                process.env[key.trim()] = value.join('=').trim()
            }
        })
    }
}

async function debugSupabase() {
    loadEnv()
    console.log('--- Supabase Debug ---')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Anon Key defined:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('ERROR: Missing Supabase URL or Anon Key in .env.local')
        return
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
        const { data, error } = await supabase.from('products').select('id, name, images').limit(1)
        if (error) {
            console.error('Error fetching products:', error.message)
        } else {
            console.log('Connection successful! Found product:', data[0]?.name)
            console.log('Image URL example:', data[0]?.images?.[0])
        }
    } catch (e: any) {
        console.error('Catch Error:', e.message)
    }
}

debugSupabase()
