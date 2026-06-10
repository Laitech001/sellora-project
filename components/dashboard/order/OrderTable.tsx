'use client'

import { Table } from '@/ui';
import { OrderRow } from '@/components/dashboard/order'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { OrderDetailsModal } from '@/components/dashboard/order'
import { getOrderItems } from '@/lib/data/Orders';

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

type OrderItemsProps = {
  id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    product_price: number;
    subtotal: number;
    product_image: string;
};

type SelectedOrderProps = {
  id: string;
  customer_name: string;
  customer_number: number;
  total_price: number;
  total_items: number;
  total_quantity: number;
  status: string;
  created_at: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export default function OrderTable({ orders }: orderProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemsProps[]>([]);

  const selectedOrder = orders.find(
    order => order.id === selectedId
  );

  const handleClick = (orderId: string) => {
    setSelectedId(orderId);
    setIsModalOpen(true);
  }

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (selectedOrder?.id) {
        const items = await getOrderItems(selectedOrder.id);
        setOrderItems(items);
      }
    };

    fetchOrderItems();
  }, [selectedOrder]);

  return (
    <>
      <Table className='hidden lg:block border border-slate-500 rounded-lg'>
        <thead>
          <tr className="text-left text-sm font-semibold text-gray-200 border-b border-slate-500 py-4">
            <th className='py-3'>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            orders.map((order) => (
              <OrderRow key={order.id} order={order} onClick={handleClick} />
            ))
          }
        </tbody>
      </Table>

      <OrderDetailsModal 
        isOpen={isModalOpen}
        orderId={selectedId}
        onClose={() => setIsModalOpen(false)}
        orderItems={orderItems}
        orderStatus={selectedOrder?.status}
        customerName={selectedOrder?.customer_name}
        customerNumber={selectedOrder?.customer_number}
        orderTotalPrice={selectedOrder?.total_price}
        orderDate={selectedOrder?.created_at}
      />
    </>
    
  )
}