import { NextResponse } from 'next/server'
import { shiprocketFetch } from '@/lib/shiprocket'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ awb: string }> }
) {
  const { awb } = await params

  if (!awb) {
      return NextResponse.json({ error: 'AWB number is required' }, { status: 400 })
  }

  try {
    const data = await shiprocketFetch(`/courier/track/awb/${awb}`)

    const tracking = data.tracking_data
    const activity = tracking?.shipment_track_activities ?? []

    return NextResponse.json({
      current_status: tracking?.track_url
        ? tracking.shipment_track?.[0]?.current_status
        : 'Processing',
      etd:            tracking?.shipment_track?.[0]?.etd,
      courier:        tracking?.shipment_track?.[0]?.courier_name,
      activities:     activity.map((a: any) => ({
        date:         a.date,
        activity:     a.activity,
        location:     a.location,
      })),
      track_url:      tracking?.track_url
    })
  } catch (err: any) {
    console.error('Shiprocket Tracking Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch tracking details' }, { status: 500 })
  }
}
