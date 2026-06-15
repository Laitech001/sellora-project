'use client'

import { TextInput, Button } from '@/ui'
import { ShoppingCart, Search, ArrowLeft } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react';
import Link from 'next/link';

type headerProps = {
  store: {
    id: string;
    name: string;
    slug: string;
  }
}

export default function Header({ store }: headerProps) {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [cartCount, setCartCount] = useState(0); // State to hold the cart item count

  const loadCartCount = () => {
  const cartData = localStorage.getItem(
    `cart-${slug}`
  );

  const cartItems = cartData
    ? JSON.parse(cartData)
    : [];

  const totalQuantity = cartItems.reduce(
  (sum: number, item: { quantity: number }) => sum + (item?.quantity || 0),
  0
);

  setCartCount(totalQuantity);
};

  useEffect(() => {
    loadCartCount();

    window.addEventListener(
      "cartUpdated",
      loadCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        loadCartCount
      );
    };
  }, [slug]);

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-400 px-3 py-2">
      {/*Desktop Header*/}
      <div className="hidden lg:flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        <div className="shrink-0">
          <h1 className="text-2xl text-primary-600 font-bold">
            {store.name}
          </h1>
        </div>

        <div className="relative w-full max-w-xl">
          <TextInput
            variant='light' 
            type="text" 
            placeholder="Search for products" 
            className='w-full border rounded-full py-2 pl-8 pr-24 outline-none focus:ring-1 focus:ring-primary-500'
          />
          <Search size={20} className='absolute top-2.5 left-2 text-gray-500'/>
          <Button 
            size='small' 
            className="absolute right-1 top-px px-5 py-2 bg-blue-600 text-white rounded-full cursor-pointer"
          >
            Search
          </Button>
        </div>


        <Link
          href={`/store/${slug}/cart`}
          className="flex items-center gap-4 bg-transparent border-none relative shrink-0 cursor-pointer"
        >
          <ShoppingCart size={24} className="text-gray-700" />
          {/* Cart Count Badge */}
          <span className="absolute -top-2 left-4 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>

          <p className='text-gray-700 font-semibold'>Cart</p>
        </Link>
        
      </div>

      {/*Mobile Header*/}
      <div className="lg:hidden relative">
        <div className="flex justify-between items-center">
          
          <h1 className="text-xl md:text-2xl text-primary-600 font-bold">
            {store.name}
          </h1>

          <div className="flex items-center gap-4">
            <button onClick={() => setShowSearchBar(prev => !prev)}>
              <Search size={26} />
            </button>

            <Link href={`/store/${slug}/cart`} className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 left-4 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        {showSearchBar && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b">

              <button onClick={() => setShowSearchBar(false)}>
                <ArrowLeft size={18}/>
              </button>

              <div className='relative'>    
                <TextInput
                  variant='light'
                  type="text"
                  placeholder="Search products..."
                  className='w-full border rounded-full py-2 pl-8 pr-24 outline-none focus:ring-1 focus:ring-primary-500'
                />
                <Search size={20} className='absolute top-2.5 left-2 text-gray-500'/>
                <Button 
                  size='small' 
                  className="absolute right-1 top-px px-5 py-2 bg-blue-600 text-white rounded-full cursor-pointer"
                >
                  Search
                </Button>
              </div>  
            </div>

            {/* suggestions area */}
            <div className="p-4 text-sm text-gray-500">
              Start typing to search products...
            </div>
            
          </div>
        )}
      </div>
  </header>
  )
}