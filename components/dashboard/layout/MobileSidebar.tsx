"use client"
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useParams, notFound } from 'next/navigation';
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
import { useState } from 'react';
import { useLogout } from '@/hooks/useLogout';
import { BrandLogoName } from '@/ui/Brand';

type menuButtonProps = {
  store: {
    id: string;
    name: string;
    slug: string;
  }
}

export default function MenuButton({ store }: menuButtonProps) {
  const params = useParams();
  const storeSlug = params.slug;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, isLoading } = useLogout();

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

  function getStoreInitials(name: string) {
    return name
      .split(" ")
      .slice(0, 2)
      .map(word => word[0])
      .join("")
      .toUpperCase();
  }

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
            className={`fixed flex flex-col justify-between top-0 left-0 h-screen w-60 bg-card text-gray-200 p-4 z-50 transition-transform duration-300 ease-out lg:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`
          }>
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
      )}
    </div>
  )
}