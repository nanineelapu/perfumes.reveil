import Link from "next/link"

export function AdminSidebar() {
  return (
    <aside className="w-64 h-screen border-r border-border p-6 bg-muted/30">
      <div className="mb-10 text-xl font-bold tracking-tighter italic">ADMIN PANEL</div>
      <nav className="space-y-4">
        <Link href="/admin" className="block text-sm hover:text-accent transition-colors">Dashboard</Link>
        <Link href="/admin/products" className="block text-sm hover:text-accent transition-colors">Products</Link>
        <Link href="/admin/orders" className="block text-sm hover:text-accent transition-colors">Orders</Link>
        <Link href="/admin/settings" className="block text-sm hover:text-accent transition-colors">Settings</Link>
      </nav>
    </aside>
  )
}
