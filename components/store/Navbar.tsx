import Link from "next/link"
import { Button } from "@/components/ui/button"

export function StoreNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img
            src="https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/LOGO.webp"
            alt="Reveil Logo"
            className="h-12 w-auto"
          />
        </Link>
        <div className="flex items-center space-x-8">
          <Link href="/collections" className="text-xs uppercase tracking-widest text-foreground/60 hover:text-accent">
            Collections
          </Link>
          <Link href="/cart" className="text-xs uppercase tracking-widest text-foreground/60 hover:text-accent">
            Bag
          </Link>
          <Button variant="outline" size="sm">Explore</Button>
        </div>
      </div>
    </nav>
  )
}
