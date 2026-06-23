import { Card, Button } from '@/ui'
import OrderButton from './OrderButton';

type CartSummaryProps = {
  totalItems: number;
  totalPrice: number;
  onClick: () => void;
}

export default function CartSummary({ totalItems, totalPrice, onClick }: CartSummaryProps) {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };
  
  return (
    <Card
      variant='light' 
      className='border border-gray-200 shadow rounded-sm p-4 m-2'
    >
      <h1 className='text-center md:text-2xl lg:text-3xl font-semibold'>Cart Summary</h1>
      
      <section className='flex justify-between items-center p-4 border-b border-gray-400'>
        <p>Total Items:</p>

        <h1>{totalItems}</h1>
      </section>

      <section className='flex justify-between items-center gap-4 p-4 mb-4 border-b border-gray-400'>
        <p>Total Price:</p>

        <h1 className='text-emerald-400 text-xl md-2xl font-semibold'>{formatPrice(totalPrice)}</h1>
      </section>

      <OrderButton
        className='w-full rounded-full' 
        onClick={onClick} 
      />
    </Card> 
  )
}