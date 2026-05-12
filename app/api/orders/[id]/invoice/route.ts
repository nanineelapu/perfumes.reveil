import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = Promise<{ id: string }>

function escape(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function inr(n: number): string {
  return '₹' + Number(n || 0).toLocaleString('en-IN')
}

export async function GET(_req: Request, { params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles ( full_name, phone ),
      order_items (
        quantity, price,
        products ( name )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const { data: viewerProfile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (viewerProfile?.role !== 'admin' && order.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const items: any[] = order.order_items || []
  const itemsSubtotal = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0)
  const shipping = Number(order.shipping_cost || 0)
  const cod = Number(order.cod_charge || 0)
  const grandTotal = Number(order.total || itemsSubtotal + shipping + cod)
  const orderNo = String(order.id).slice(0, 8).toUpperCase()
  const placedOn = new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const customer = (order.profiles as any)?.full_name || 'Customer'
  const phone = (order.profiles as any)?.phone || ''
  const addr = order.shipping_address || {}

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${escape(orderNo)} — REVEIL</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #f5f5f4; color: #111; font-family: 'Helvetica Neue', Arial, sans-serif; }
  .sheet { max-width: 800px; margin: 24px auto; background: #fff; padding: 48px 56px; border: 1px solid #e7e5e4; }
  .row { display: flex; justify-content: space-between; align-items: flex-start; }
  .brand { font-family: Georgia, 'Times New Roman', serif; font-size: 28px; letter-spacing: 0.35em; font-weight: 300; }
  .brand small { display: block; font-size: 9px; letter-spacing: 0.35em; color: #8a8a8a; margin-top: 4px; text-transform: uppercase; }
  .meta { text-align: right; font-size: 12px; color: #555; line-height: 1.6; }
  .meta strong { color: #111; }
  h2 { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #8a8a8a; margin: 36px 0 10px; font-weight: 600; }
  .panel { font-size: 13px; line-height: 1.7; color: #222; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  thead th { text-align: left; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #8a8a8a; padding: 10px 8px; border-bottom: 1px solid #e7e5e4; font-weight: 600; }
  tbody td { padding: 14px 8px; border-bottom: 1px solid #f1f1f0; vertical-align: top; }
  tbody td.qty, tbody td.amt { text-align: right; white-space: nowrap; }
  thead th.qty, thead th.amt { text-align: right; }
  .totals { margin-top: 16px; margin-left: auto; width: 320px; font-size: 13px; }
  .totals .line { display: flex; justify-content: space-between; padding: 8px 0; color: #444; }
  .totals .grand { border-top: 2px solid #111; margin-top: 6px; padding-top: 12px; font-size: 15px; font-weight: 700; color: #111; }
  .gold { color: #b8932f; }
  .foot { margin-top: 56px; padding-top: 20px; border-top: 1px solid #e7e5e4; font-size: 11px; color: #8a8a8a; text-align: center; line-height: 1.8; }
  .pill { display: inline-block; padding: 3px 10px; border: 1px solid #b8932f; color: #b8932f; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; border-radius: 999px; }
  .actions { max-width: 800px; margin: 16px auto 0; display: flex; gap: 12px; justify-content: flex-end; }
  .btn { padding: 10px 18px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; border: 1px solid #111; background: #111; color: #fff; cursor: pointer; }
  .btn.ghost { background: transparent; color: #111; }
  @media print {
    body { background: #fff; }
    .sheet { box-shadow: none; border: none; margin: 0; max-width: none; padding: 24px; }
    .actions { display: none; }
  }
</style>
</head>
<body>
  <div class="sheet">
    <div class="row">
      <div>
        <div class="brand">REVEIL<small>Studio Archive</small></div>
        <div style="font-size:11px;color:#8a8a8a;margin-top:10px;">Trimurty Enterprises<br/>Brahmapur, Odisha, India</div>
      </div>
      <div class="meta">
        <span class="pill">Tax Invoice</span><br/>
        <strong>Invoice #</strong> ${escape(orderNo)}<br/>
        <strong>Date</strong> ${escape(placedOn)}<br/>
        <strong>Payment</strong> ${escape((order.payment_method || '—').toString().toUpperCase())}<br/>
        <strong>Status</strong> ${escape((order.payment_status || 'pending').toString().toUpperCase())}
      </div>
    </div>

    <h2>Billed To</h2>
    <div class="panel">
      <strong>${escape(customer)}</strong><br/>
      ${addr.line1 ? escape(addr.line1) + '<br/>' : ''}
      ${addr.line2 ? escape(addr.line2) + '<br/>' : ''}
      ${[addr.city, addr.state, addr.pincode].filter(Boolean).map(escape).join(', ')}<br/>
      ${phone ? 'Phone: ' + escape(phone) : ''}
    </div>

    <h2>Order Items</h2>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="qty">Qty</th>
          <th class="amt">Unit</th>
          <th class="amt">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((it) => `
          <tr>
            <td>${escape(it.products?.name || 'Item')}</td>
            <td class="qty">${escape(it.quantity)}</td>
            <td class="amt">${inr(it.price)}</td>
            <td class="amt">${inr((it.price || 0) * (it.quantity || 0))}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="line"><span>Subtotal</span><span>${inr(itemsSubtotal)}</span></div>
      <div class="line"><span>Shipping</span><span>${shipping > 0 ? inr(shipping) : 'Free'}</span></div>
      ${cod > 0 ? `<div class="line"><span>COD Charge</span><span>${inr(cod)}</span></div>` : ''}
      <div class="line grand"><span>Total Paid</span><span class="gold">${inr(grandTotal)}</span></div>
    </div>

    <div class="foot">
      Thank you for choosing REVEIL.<br/>
      For any questions about this invoice, write to <strong>reveilfragrances@gmail.com</strong>.<br/>
      This is a system-generated invoice and does not require a signature.
    </div>
  </div>

  <div class="actions">
    <button class="btn ghost" onclick="window.close()">Close</button>
    <button class="btn" onclick="window.print()">Save as PDF</button>
  </div>

  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 400);
    });
  </script>
</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
