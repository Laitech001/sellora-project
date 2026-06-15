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

function getStoreInitials(name: string) {
    return name
      .split(" ")
      .slice(0, 2)
      .map(word => word[0])
      .join("")
      .toUpperCase();
  }

export default function Header({ store }: headerProps) {
  const pathName = usePathname();
  const segments = pathName.split('/').filter(Boolean);

  return (
    <div className='bg-dark w-full px-4 py-2 border-b border-slate-500'>
      {/* Mobile Header */}
      <div className='flex justify-between items-center overflow-x-hidden lg:hidden'>
        <MenuButton store={store} />

        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <span>{formatSegment(segment)}</span>
          </div>
        ))}

        
        <div className="flex items-center gap-4">
          <section className='p-2 bg-circle-background border border-slate-500 rounded-full w-max'>
            <h1 className='font-semibold'>
              {getStoreInitials(store.name)}
            </h1>
          </section>
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