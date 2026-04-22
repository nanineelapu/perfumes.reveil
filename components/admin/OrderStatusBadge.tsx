import React from 'react'

const statusStyles: Record<string, { bg: string, text: string, label: string }> = {
    pending: { bg: '#fffbeb', text: '#92400e', label: 'Pending' },
    processing: { bg: '#fffbeb', text: '#92400e', label: 'Processing' },
    confirmed: { bg: '#f0f9ff', text: '#075985', label: 'Confirmed' },
    shipped: { bg: '#f5f3ff', text: '#5b21b6', label: 'Shipped' },
    'in transit': { bg: '#fdf4ff', text: '#701a75', label: 'In Transit' },
    delivered: { bg: '#f0fdf4', text: '#166534', label: 'Delivered' },
    cancelled: { bg: '#fef2f2', text: '#991b1b', label: 'Cancelled' },
}

export default function OrderStatusBadge({ status }: { status: string }) {
    const style = statusStyles[status] || { bg: '#f1f5f9', text: '#475569', label: status }

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: style.bg,
            color: style.text,
            border: `1px solid ${style.text}20`
        }}>
            <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: style.text,
                marginRight: '8px'
            }} />
            {style.label}
        </span>
    )
}
