'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

type CartItem = {
    id: string
    quantity: number
    products: {
        id: string
        name: string
        slug: string
        price: number
        images: string[]
        stock: number
    }
}

type CartState = {
    items: CartItem[]
    subtotal: number
    shipping: number
    total: number
    itemCount: number
    loading: boolean
    addItem: (product_id: string, quantity?: number) => Promise<void>
    removeItem: (id: string) => Promise<void>
    updateQty: (id: string, quantity: number) => Promise<void>
    clearCart: () => Promise<void>
    refresh: () => Promise<void>
}

const CartContext = createContext<CartState | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [subtotal, setSubtotal] = useState(0)
    const [shipping, setShipping] = useState(30)
    const [total, setTotal] = useState(0)
    const [itemCount, setItemCount] = useState(0)
    const [loading, setLoading] = useState(false)

    const refresh = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/cart')
            if (res.ok) {
                const data = await res.json()
                setItems(data.items)
                setSubtotal(data.subtotal)
                setShipping(data.shipping)
                setTotal(data.total)
                setItemCount(data.itemCount)
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { refresh() }, [refresh])

    async function addItem(product_id: string, quantity = 1) {
        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id, quantity }),
        })
        if (res.ok) await refresh()
        else {
            const data = await res.json()
            throw new Error(data.error)
        }
    }

    async function removeItem(id: string) {
        await fetch(`/api/cart/${id}`, { method: 'DELETE' })
        await refresh()
    }

    async function updateQty(id: string, quantity: number) {
        await fetch(`/api/cart/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
        })
        await refresh()
    }

    async function clearCart() {
        await fetch('/api/cart', { method: 'DELETE' })
        await refresh()
    }

    return (
        <CartContext.Provider value={{
            items, subtotal, shipping, total,
            itemCount, loading,
            addItem, removeItem, updateQty, clearCart, refresh,
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used inside CartProvider')
    return ctx
}