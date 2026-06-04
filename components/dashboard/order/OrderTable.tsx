'use client'

import { Table } from '@/ui';
import { OrderRow } from '@/components/dashboard/order'
import { useRouter } from 'next/navigation';

type orderProps = {
  orders: {
    id: string;
    customer_name: string;
    customer_number: number;
    total_price: number;
    total_items: number;
    total_quantity: number;
    status: string;
    created_at: string;
  }[]
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export default function OrderTable({ orders }: orderProps) {
  const router = useRouter();

  const handleChange = async (id: string, status: string) => {

    try {
      const res = await fetch(`${baseUrl}/api/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      const result = await res.json();

      if (!res.ok) {
        console.log(result.message);
        return
      }

      router.refresh();
    } catch (error) {
      alert('Failed to update order status')
    }
  }

  return (
    <Table className='hidden lg:block border border-slate-500 rounded-lg'>
      <thead>
        <tr className="text-left text-sm font-semibold text-gray-200 border-b border-slate-500 py-4">
          <th className='py-3'>Customer Name</th>
          <th>Customer Number</th>
          <th>Product</th>
          <th>Price</th>
          <th>Status</th>
          <th>quantity</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {
          orders.map((order) => (
            
            <OrderRow key={order.id} order={order} onChange={handleChange}/>
          ))
        }
      </tbody>
    </Table>
  )
}