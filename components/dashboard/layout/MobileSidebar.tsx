"use client"
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings  
} from "lucide-react";
import { useState } from 'react'

export default function MenuButton() {
  const params = useParams();
  const storeSlug = params.slug;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  type NavLink = {
    href: string,
    label: string,
    icon: React.ElementType
  }

  const links: NavLink[] = [
    { href: `/dashboard/${storeSlug}`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/dashboard/${storeSlug}/products`, label: 'Products', icon: Package },
    { href: `/dashboard/${storeSlug}/orders`, label: 'Orders', icon: ShoppingCart },
    { href: `/dashboard/${storeSlug}/analytics`, label: 'Analytics', icon: BarChart3},
    { href: `/dashboard/${storeSlug}/settings`, label: 'Settings', icon: Settings}
  ]

  return (
    <div>
      <button onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {menuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMenuOpen(false)}
          />

          <aside 
            className={`fixed top-0 left-0 h-screen w-60 bg-card text-gray-200 p-6 z-50 transition-transform duration-300 ease-out lg:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`
          }>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-6">Sellora</h1>

            <nav className="space-y-4">
    
                {links.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href

                  return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex flex-row items-center rounded-lg gap-4 p-2 cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-primary-200 text-primary-500'
                            : 'text-gray-200 hover:bg-primary-200 hover:text-primary-500'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                  )
                })}
            </nav>

          </aside>
        </>
      )}
    </div>
  )
}