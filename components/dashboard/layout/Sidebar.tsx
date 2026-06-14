'use client'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation';
import { BrandLogoName } from '@/ui/Brand';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChevronRight,
  ArrowRight,
  BarChart3,
  Settings,
  LogOut  
} from "lucide-react";
import { useLogout } from '@/hooks/useLogout';

type sidebarProps = {
  store: {
    id: string;
    name: string;
    slug: string;
  }
}

export default function Sidebar({ store }: sidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug;
  const { logout, isLoading } = useLogout();
  
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

  function getStoreInitials(name: string) {
    return name
      .split(" ")
      .slice(0, 2)
      .map(word => word[0])
      .join("")
      .toUpperCase();
  }

  return (
    <>
      <aside className="hidden lg:flex flex-col justify-between fixed lg:top-0 lg:left-0 lg:h-screen lg:w-60 bg-dark border-r border-slate-500 p-4">
        <section className='flex flex-col justify-between'>
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
                          ? 'bg-primary-500/20 text-primary-500'
                          : 'text-gray-200 hover:bg-primary-500/20 hover:text-primary-500'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                )
              })}
          </nav>
        </section>

        <section className='space-y-1'>

          <div className='flex justify-between items-center p-2 rounded-md border border-slate-500'>
               
            <div className='flex items-center gap-1'>
              <section className='p-2 bg-circle-background border border-slate-500 rounded-full w-max'>
                <h1 className='font-semibold'>
                  {getStoreInitials(store.name)}
                </h1>
              </section>

              <section className='flex flex-col'>
                <h1 className='font-semibold text-md'>{store.name}</h1>

                <Link 
                  href={`/store/${store.slug}`}
                  className='text-primary-500 hover:underline flex items-center gap-1'
                >
                  <span>View Store</span>
                  <ArrowRight size={16} />
                </Link>
              </section>
            </div>

            <div>
              <Link
                href={`/store/${store.slug}`}
              >
                <ChevronRight size={20} className="text-white cursor-pointer" />
              </Link>
              
            </div>
          </div>

          <button
            onClick={logout}
            disabled={isLoading}
            className='flex items-center gap-2 p-2 rounded-md border border-slate-500 w-full cursor-pointer'
          >
            <LogOut size={18} className='text-red-400' />

            <span className='text-red-400'>
              {isLoading ? 'Logging out...' : 'Log Out'}
            </span>
          </button>
        </section>
        
      </aside>

    </>
  )
}