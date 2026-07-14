'use client'
import { Store, Building2, MapPin, Phone, ArrowRight, ChevronRight, } from 'lucide-react'
import Link from 'next/link'
import { Store as StoreType } from '@/types'

type Props = {
  stores: StoreType[] | null
}

export default function DisplayStores({stores}: Props) {

  if (!stores) {
    return;
  }

  return (
    <>
      {
        stores.map((store) => (
          <div className='bg-card text-white border border-slate-500 flex items-center justify-between  rounded-lg p-4 mb-2' key={store.id}>
            <div 
              className='flex gap-4'
            >
              <section className='flex items-center justify-center bg-primary-500 rounded-lg w-20 h-20'>
                <Store className="h-10 w-10 text-white" />
              </section>

              <section className='space-y-1'>
                <h1 className='text-lg font-bold'>{store.name}</h1>
              <p 
                className='text-gray-200 text-sm flex items-center gap-1'
              >
                <Building2 size={16} />
                <span>Business Category: {store.business_category}</span>
              </p>

              <p 
                className='text-gray-200 text-sm flex items-center gap-1'
              >
                <MapPin size={16} />
                <span>Address: {store.address ?? 'Not provided'}</span>
              </p>
              <p 
                className='text-gray-200 text-sm flex items-center gap-1'
              >
                <Phone size={16} />
                <span>Whatsapp Number: {store.whatsapp_number}</span>
              </p>
              
              <Link 
                href={`/dashboard/${store.slug}`}
                className='text-primary-500 hover:underline flex items-center gap-1'
              >
                <span>Go to Store Dashboard</span>
                <ArrowRight size={16} />
              </Link>
              </section> 
            </div>

            <div className='hidden md:flex'>
              <Link
                href={`/dashboard/${store.slug}`}
              >
                <ChevronRight size={20} className="text-white cursor-pointer" />
              </Link>
              
            </div>
          </div>  
        ))
      }
    </>
  )
}