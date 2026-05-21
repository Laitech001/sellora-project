'use client'

import { TextInput, Button } from '@/ui'
import { ShoppingCart } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react';

export default function Header() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

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
    <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
      
      <div className="shrink-0">
        <h1 className="text-xl md:text-2xl text-blue-600 font-bold">
          Sellora
        </h1>
      </div>

      <div className="relative w-full max-w-xl">
        <TextInput 
          type="text" 
          placeholder="Search for products" 
          className='w-full border rounded-full py-2 pl-4 pr-24 outline-none focus:ring-1 focus:ring-blue-500'
        />
        <Button 
          size='small' 
          className="absolute right-1 top-1 px-4 py-1 bg-blue-600 text-white rounded-full cursor-pointer"
        >
          Search
        </Button>
      </div>


      <Button
        onClick={() => {router.push(`/store/${slug}/cart`)}}
        size='small' 
        className="bg-transparent border-none relative shrink-0 cursor-pointer"
      >
        <ShoppingCart size={24} className="text-gray-700" />
        {/* Cart Count Badge */}
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      </Button>
      
    </div>
  </header>
  )
}