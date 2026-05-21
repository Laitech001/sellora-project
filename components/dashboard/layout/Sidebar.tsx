'use client'
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

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug;

  type NavLink = {
    href: string,
    label: string,
    icon: React.ElementType
  }

  const links: NavLink[] = [
    { href: `/dashboard/${slug}`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/dashboard/${slug}/products`, label: 'Products', icon: Package },
    { href: `/dashboard/${slug}/orders`, label: 'Orders', icon: ShoppingCart },
    { href: `/dashboard/${slug}/customers`, label: 'Customers', icon: Users},
    { href: `/dashboard/${slug}/analytics`, label: 'Analytics', icon: BarChart3},
    { href: `/dashboard/${slug}/settings`, label: 'Settings', icon: Settings}
  ]
  return (
    <>

      <aside className="hidden lg:block fixed lg:top-0 lg:left-0 lg:h-screen lg:w-60 bg-gray-200 p-6">
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
  )
}