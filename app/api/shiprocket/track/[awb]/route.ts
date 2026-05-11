import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require'
import { shiprocketFetch } from '@/lib/shiprocket'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ awb: string }> }
) {
  const { awb } = await params

  if (!awb || !/^[a-zA-Z0-9-]{1,40}$/.test(awb)) {
    return NextResponse.json({ error: 'AWB number is required' }, { status: 400 })
  }

  const auth = await requireUser()
  if (!auth.ok) return auth.response

  const { data: order } = await auth.supabase
    .from('orders')
    .select('id, user_id')
    .eq('awb_code', awb)
    .maybeSingle()

  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (order.user_id !== auth.user.id) {
    const { data: profile } = await auth.supabase
      .from('profiles')
      .select('role')
      .eq('id', auth.user.id)
      .single()
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  try {
    const data = await shiprocketFetch(`/courier/track/awb/${encodeURIComponent(awb)}`)

    const tracking = data.tracking_data
    const activity = tracking?.shipment_track_activities ?? []

    return NextResponse.json({
      current_status: tracking?.track_url ? tracking.shipment_track?.[0]?.current_status : 'Processing',
      etd: tracking?.shipment_track?.[0]?.etd,
      courier: tracking?.shipment_track?.[0]?.courier_name,
      activities: activity.map((a: any) => ({
        date: a.date,
        activity: a.activity,
        location: a.location,
      })),
      track_url: tracking?.track_url,
    })
  } catch (err: any) {
    console.error('Shiprocket Tracking Error:', err?.message)
    return NextResponse.json({ error: 'Failed to fetch tracking details' }, { status: 500 })
  }
}
