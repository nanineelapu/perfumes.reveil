import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function TrackingPage(props: {
    params: Promise<{ awb: string }>
}) {
    const params = await props.params
    const supabase = await createClient()

    // Fetch order from Supabase by AWB
    const { data: order } = await supabase
        .from('orders')
        .select(`
            id, 
            status, 
            courier_name, 
            awb_code, 
            created_at, 
            shipping_address, 
            total,
            order_items(quantity, price, products(name, images))
        `)
        .eq('awb_code', params.awb)
        .single()

    if (!order) notFound()

    // Fetch live tracking from Shiprocket API
    let tracking: any = null
    try {
        // Use full URL or relative if on same server
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/shiprocket/track/${params.awb}`, { 
            next: { revalidate: 300 } 
        })
        if (res.ok) tracking = await res.json()
    } catch (err) {
        console.error('Tracking fetch error:', err)
    }

    const steps = [
        { key: 'pending', label: 'Order Registered', icon: Clock },
        { key: 'confirmed', label: 'Atelier Confirmed', icon: CheckCircle2 },
        { key: 'shipped', label: 'In Transit', icon: Truck },
        { key: 'out_for_delivery', label: 'Near Destination', icon: MapPin },
        { key: 'delivered', label: 'Hand Delivered', icon: ShoppingBag },
    ]

    const statusMap: Record<string, number> = {
        'pending': 0,
        'confirmed': 1,
        'shipped': 2,
        'out_for_delivery': 3,
        'delivered': 4,
        'failed_delivery': 2,
        'cancelled': -1,
        'return_initiated': 2,
        'returned': 4
    }

    const currentIndex = statusMap[order.status] ?? 0
    const address = order.shipping_address as any

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingTop: '100px', paddingBottom: '100px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
                
                {/* Header Section */}
                <div style={{ marginBottom: '60px' }}>
                    <Link href="/orders" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', marginBottom: '24px' }}>
                        <ArrowLeft size={12} /> Return to Orders
                    </Link>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontFamily: 'var(--font-baskerville)', fontWeight: 300, margin: 0, letterSpacing: '0.05em' }}>
                        Tracking <span style={{ color: '#d4af37', fontStyle: 'italic' }}>#{order.id.slice(0, 8).toUpperCase()}</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '12px' }}>
                        Studio Archive Logistics Portal
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', alignItems: 'start' }}>
                    
                    {/* Left Column: Progress & Activity */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        {/* Status Card */}
                        <div style={{ 
                            background: 'linear-gradient(145deg, #0a0a0a 0%, #000 100%)', 
                            border: '1px solid rgba(212,175,55,0.15)', 
                            padding: '40px',
                            borderRadius: '4px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
                            
                            <h2 style={{ fontSize: '12px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '40px', textAlign: 'center' }}>
                                Journey Progression
                            </h2>

                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 20px' }}>
                                {/* Timeline Line */}
                                <div style={{ position: 'absolute', top: '15px', left: '40px', right: '40px', height: '1px', background: 'rgba(212,175,55,0.1)' }} />
                                <div style={{ 
                                    position: 'absolute', top: '15px', left: '40px', 
                                    height: '1px', background: '#d4af37',
                                    width: `${(currentIndex / 4) * 80}%`, // Approx width based on steps
                                    boxShadow: '0 0 10px #d4af37',
                                    transition: 'width 1s ease'
                                }} />

                                {steps.map((step, i) => {
                                    const isCompleted = i <= currentIndex
                                    const isCurrent = i === currentIndex
                                    const Icon = step.icon

                                    return (
                                        <div key={step.key} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ 
                                                width: '32px', height: '32px', borderRadius: '50%', 
                                                background: isCompleted ? '#d4af37' : '#050505',
                                                border: `1px solid ${isCompleted ? '#d4af37' : 'rgba(212,175,55,0.2)'}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: isCurrent ? '0 0 20px rgba(212,175,55,0.4)' : 'none',
                                                transition: 'all 0.5s'
                                            }}>
                                                <Icon size={14} color={isCompleted ? '#000' : 'rgba(212,175,55,0.4)'} />
                                            </div>
                                            <span style={{ 
                                                fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', 
                                                color: isCompleted ? '#fff' : 'rgba(255,255,255,0.2)',
                                                fontWeight: isCurrent ? 700 : 400,
                                                textAlign: 'center', maxWidth: '60px'
                                            }}>
                                                {step.label}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Activity Log Section */}
                        {tracking?.activities?.length > 0 && (
                            <div style={{ padding: '20px 0' }}>
                                <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-baskerville)', color: '#d4af37', marginBottom: '32px', letterSpacing: '0.1em' }}>Logistics Activity</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {tracking.activities.map((act: any, i: number) => (
                                        <div key={i} style={{ 
                                            display: 'flex', gap: '24px', 
                                            padding: '24px', 
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '2px'
                                        }}>
                                            <div style={{ paddingTop: '4px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === 0 ? '#d4af37' : 'rgba(212,175,55,0.2)', boxShadow: i === 0 ? '0 0 10px #d4af37' : 'none' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '13px', margin: 0, fontWeight: 500, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.6)' }}>{act.activity}</p>
                                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                    <span>{act.location}</span>
                                                    <span>•</span>
                                                    <span>{act.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Info Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Courier Details */}
                        <div style={{ padding: '32px', background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '2px' }}>
                            <h4 style={{ fontSize: '10px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '24px' }}>Fulfillment Partner</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Courier</p>
                                    <p style={{ fontSize: '14px', margin: 0, fontWeight: 500 }}>{order.courier_name || 'Processing'}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 4px 0' }}>AWB Master</p>
                                    <p style={{ fontSize: '14px', margin: 0, fontWeight: 500, fontFamily: 'monospace', color: '#d4af37' }}>{order.awb_code}</p>
                                </div>
                                {tracking?.etd && (
                                    <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '4px' }}>
                                        <p style={{ fontSize: '8px', color: '#d4af37', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Estimated Arrival</p>
                                        <p style={{ fontSize: '13px', margin: 0, fontWeight: 700 }}>{tracking.etd}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Destination */}
                        <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                            <h4 style={{ fontSize: '10px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '24px' }}>Destination</h4>
                            <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                                {address.name || 'Valued Client'}<br />
                                {address.line1 || address.address}<br />
                                {address.city}, {address.state} {address.pincode}
                            </p>
                        </div>

                        {/* Items Preview */}
                        <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                            <h4 style={{ fontSize: '10px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '24px' }}>Creations</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {order.order_items.map((item: any, i: number) => (
                                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '2px', overflow: 'hidden' }}>
                                            <img src={item.products?.images?.[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', margin: 0 }}>{item.products?.name}</p>
                                            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', margin: '2px 0 0 0' }}>Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
