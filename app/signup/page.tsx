import { AuthForm } from '@/components/auth';
import {
  Store,
  Package,
  ShoppingCart,
  Laptop,
} from "lucide-react";


export default function SignUp() {

  const signupCard = [
    {
      name: 'Create a professional online store',
      logo: Store
    }, {
      name: 'Manage products and inventory',
      logo: Package
    }, {
      name: 'Track customer orders easily',
      logo: ShoppingCart
    }, {
      name: 'Access your business anywhere',
      logo: Laptop
    }
  ]

  return (
    <div className='min-h-screen bg-linear-to-r from-primary-500 to-accent-500 bg-fixed overflow-x-hidden'>

      <header className='p-2'>
        <div className='flex gap-2 items-center'>
          <h1 className='flex justify-center items-center h-8 w-8 bg-linear-to-r from-primary-500 to-accent-500 text-white text-xl font-semibold rounded-md'>S</h1>
          <span className='text-xl text-white'>Sellora</span>
        </div>
      </header>
      
      <section className='flex items-center justify-center lg:justify-evenly lg:gap-6 lg:items-center'>

        <section className='hidden max-h-screen text-white lg:flex flex-col gap-6 p-4'>

          <div>
            <h1 className='mb-2 lg:text-3xl font-bold tracking-tight'>Take Control of Your Business Online</h1>

            <p className='text-gray-100'>Create your on store, manage products, track orders, and grow your business from one dashboard.</p>
          </div>
          
          <div className='space-y-4'>
            <div className="max-w-sm flex items-center gap-3 p-4 border border-gray-200 shadow-sm rounded-md">
              <Store className="h-8 w-8 text-gray-200" />
              <span>Create a professional online store</span>
            </div>

            <div className="max-w-sm flex items-center gap-3 p-4 border border-gray-200 shadow-sm rounded-md">
              <Package className="h-8 w-8 text-gray-200" />
              <span>Manage products and inventory</span>
            </div>

            <div className="max-w-sm flex items-center gap-3 p-4 border border-gray-200 shadow-sm rounded-md">
              <ShoppingCart className="h-8 w-8 text-gray-200" />
              <span>Track customer orders easily</span>
            </div>

            <div className="max-w-sm flex items-center gap-3 p-4 border border-gray-200 shadow-sm rounded-md">
              <Laptop className="h-8 w-8 text-gray-200" />
              <span>Access your business anywhere</span>
            </div>
          </div>

          <p>Start building your online presence today</p>
        </section>

        <section className='min-w-xl'>
          <AuthForm />
        </section> 

      </section>
    </div>
  )
}