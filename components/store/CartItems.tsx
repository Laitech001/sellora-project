'use client'
import { Button } from '@/ui'
import  Image  from 'next/image'
import { Plus, Minus } from 'lucide-react'

type CartItemsProps = {
  item: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  removeItem: (productId: string) => void;
} 

export default function CartItems({ item, increaseQuantity, decreaseQuantity, removeItem }: CartItemsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  return (
    <div className='border-b border-gray-400 p-2'>
      <section className='lg:flex items-center justify-between mb-2'>
        <div className='flex items-start gap-4'>
          <div>
            <Image 
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              priority
              className='rounded'
            />
          </div>

          <h1>{item.name}</h1>
        </div>

        <div className='mt-2'>
          <h1 className='text-emerald-400 text-xl md-2xl font-semibold'>{formatPrice(item.price)}</h1>
        </div>
      </section>

      <section className='flex items-center justify-between'>
        <div>
          <Button
            variant='danger'
            onClick={() => removeItem(item.productId)}
          >
            Remove
          </Button>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            onClick={() => decreaseQuantity(item.productId)}
          >
            <Minus size={16} />
          </Button>

          <p className='md:text-xl'>{item.quantity}</p>

          <Button
            onClick={() => increaseQuantity(item.productId)}
          >
            <Plus size={16} />
          </Button>
        </div>
      </section>
  
    </div>
  )
}