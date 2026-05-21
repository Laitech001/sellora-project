'use client'

import { Bell, User,} from 'lucide-react'
import MenuButton from './MobileSidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from "lucide-react";


export default function Header() {
  const pathName = usePathname();
  const segments = pathName.split('/').filter(Boolean);

  return (
    <div className='bg-white w-full px-4 py-2 border-b border-gray-400'>
      {/* Mobile Header */}
      <div className='flex justify-between items-center overflow-x-hidden lg:hidden'>
        <MenuButton />

        <h2 className='text-xl font-semibold'>Sellora</h2>

        <div className="flex items-center gap-4">
          <Link href="/dashboard/notifications" className="p-2 rounded-full bg-gray-200">
            <Bell size={22}/>
          </Link>

          <Link href="/dashboard/profile" className="p-2 rounded-full bg-gray-200">
            <User size={22}/>
          </Link>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex flex-col">
        {/* Breadcrumb */}
        <section className="flex items-center gap-2 text-sm text-gray-500">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{formatSegment(segment)}</span>

              {index < segments.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          ))}
        </section>

        {/* Page Title */}
        <h1 className="text-xl font-semibold text-gray-800 mt-1">
          {formatSegment(segments[segments.length - 1])}
        </h1>
      </div>
      
    </div>
  )
  function formatSegment(segment: string) {
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }
}