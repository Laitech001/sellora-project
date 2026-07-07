'use client';

import { OrderCard } from '@/components/dashboard/order';
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

export default function OrderCardList({ orders }: orderProps) {
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
      <section className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden'>
        {
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={handleClick}
            />
          ))
        }
      </section>

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