'use client'

export default function DeleteProductButton({ id }: { id: string }) {
    async function handleDelete() {
        if (!confirm('Delete this product?')) return
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
            if (res.ok) {
                window.location.reload()
            } else {
                alert('Failed to delete product')
            }
        } catch (err) {
            console.error(err)
            alert('An error occurred while deleting')
        }
    }
    
    return (
        <button 
            onClick={handleDelete} 
            style={{
                padding: '5px 12px', 
                background: '#fef2f2', 
                border: 'none',
                borderRadius: '6px', 
                color: '#ef4444', 
                fontSize: '13px', 
                cursor: 'pointer',
            }}
        >
            Delete
        </button>
    )
}
