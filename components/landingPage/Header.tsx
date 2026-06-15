'use client'

import Link from 'next/link';
import { BrandLogoName } from '@/ui/Brand';


export default function LandingPageHeader() {
  return (
    <div className='p-4 border-b border-slate-500 flex justify-between items-center'>

      <BrandLogoName />

      <nav className='text-content flex items-center gap-4'>
        <Link href={'#home'} className='hover:text-primary-500 hover:underline transition-all'>Home</Link>

        <Link href={'#about'} className='hover:text-primary-500 hover:underline transition-all'>About</Link>

        <Link href={'#features'} className='hover:text-primary-500 hover:underline transition-all'>Features</Link>

        <Link href={'#contact'} className='hover:text-primary-500 hover:underline transition-all'>Contact</Link>
      </nav>

      <section className='flex items-center gap-4'>
        <Link href={'/signup'} className='bg-card text-content border border-slate-500 py-2 px-3 rounded-lg'>Log in</Link>

        <Link href={'/signup'} className='bg-linear-to-r from-primary-500 to-accent-500 text-white py-2 px-3 rounded-lg'>Start free</Link>
      </section>
    </div>
  )
}