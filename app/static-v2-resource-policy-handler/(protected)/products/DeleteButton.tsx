'use client'

import { useRouter } from 'next/navigation'

export default function DeleteButton({ id }: { id: string }) {
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('Delete product?')) return

        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        })

        if (res.ok) router.refresh()
        else alert('Delete failed')
    }

    return (
        <button onClick={handleDelete} className="text-red-600">
            Delete
        </button>
    )
}