'use client'

import { Bell, User,} from 'lucide-react'
import MenuButton from './MobileSidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from "lucide-react";
import { BrandLogoName } from '@/ui/Brand';

type headerProps = {
  store: {
    id: string;
    name: string;
    slug: string;
  }
}

export default function Header({ store }: headerProps) {
  const pathName = usePathname();
  const segments = pathName.split('/').filter(Boolean);

  return (
    <div className='bg-dark w-full px-4 py-2 border-b border-slate-500'>
      {/* Mobile Header */}
      <div className='flex justify-between items-center overflow-x-hidden lg:hidden'>
        <MenuButton store={store} />

        <BrandLogoName />

        <div className="flex items-center gap-4">
          <Link href="/dashboard/notifications" className="p-2 rounded-full bg-gray-200">
            <Bell size={22} className='text-primary-500' />
          </Link>

          <Link href="/dashboard/profile" className="p-2 rounded-full bg-gray-200">
            <User size={22} className='text-primary-500' />
          </Link>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex flex-col">
        {/* Breadcrumb */}
        <section className="flex items-center gap-2 text-sm text-gray-200">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{formatSegment(segment)}</span>

              {index < segments.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-200" />
              )}
            </div>
          ))}
        </section>

        {/* Page Title */}
        <h1 className="text-xl font-semibold text-gray-200 mt-1">
          {formatSegment(segments[segments.length - 1])}
        </h1>
      </div>
      
    </div>
  )
  function formatSegment(segment: string) {
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }
}