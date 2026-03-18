"use client"
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  type NavLink = {
    href: string,
    label: string,
    icon: React.ElementType
  }

  const links: NavLink[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/customers', label: 'Customers', icon: Users},
    { href: '/analytics', label: 'Analytics', icon: BarChart3},
    { href: '/settings', label: 'Settings', icon: Settings}
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
            className={`fixed top-0 left-0 h-screen w-60 bg-gray-200 text-gray-900 p-6 z-50 transition-transform duration-300 ease-out md:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`
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
                        className={`flex flex-row items-center rounded-lg gap-4 p-2 transition-colors ${
                          isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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