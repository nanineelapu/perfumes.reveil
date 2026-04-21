'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function DebugPage() {
    const [products, setProducts] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        supabase.from('products').select('name, slug').then(({ data }) => {
            if (data) setProducts(data)
        })
    }, [])

    return (
        <div style={{ padding: '100px', background: '#000', color: '#fff' }}>
            <h1>Database Products</h1>
            <pre>{JSON.stringify(products, null, 2)}</pre>
        </div>
    )
}
