'use client'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation';
import { BrandLogoName } from '@/ui/Brand';
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
    { href: `/dashboard/${slug}/analytics`, label: 'Analytics', icon: BarChart3},
    { href: `/dashboard/${slug}/settings`, label: 'Settings', icon: Settings}
  ]
  return (
    <>
      <aside className="hidden lg:block fixed lg:top-0 lg:left-0 lg:h-screen lg:w-60 bg-dark border-r border-slate-500 p-6">
        <div className="mb-6">
          <BrandLogoName />
        </div>

        <nav className="space-y-3">
 
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex flex-row items-center rounded-lg gap-4 p-2 transition-colors ${
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
  )
}