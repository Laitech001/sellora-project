import { supabase } from '@/lib/supabase'

type Order = {
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

export async function getRecentOrders(slug: string): Promise<Order[]> {
  try {
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', slug)
      .single();

    if (storeError) {
      console.error('Failed to fetch store data for recent orders:', storeError);
      return [];
    }

    if (!storeData) {
      console.error('Store not found for recent orders');
      return [];
    }
    // Extract store ID from the fetched store data
    const storeId = storeData.id;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false})
      .limit(5);

    if (error) {
      console.error('Failed to fetch Recent Order');
      return [];
    }
    console.log(data);
    return data;
    
  } catch (error) {
    console.error('Failed to fetch recent order:', error);
    return [];
  }
}

export async function getOrders(): Promise<Order[]> {
  const fetchOrder = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/orders`, {
        method: 'GET',
        headers: {
          'content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        console.log('Failed to fetch orders');
        return [];
      }
      const orders = await res.json();
      return orders;
    } catch(error) {
      console.error(error);
      return new Response('Error processing order', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }

  return fetchOrder();
}

export async function getOrdersBySlug(slug: string): Promise<Order[]> {
  // handle case where baseUrl is not defined
  if (!baseUrl) {
    console.error('NEXT_PUBLIC_BASE_URL is not defined');
    return [];
  }

  try {
    const res = await fetch(`${baseUrl}/api/stores/${slug}/orders`)

    if (!res.ok) {
      let message = 'Failed to fetch orders';
      console.error(message);
      return [];
    }

    const data = await res.json();
    return data.orders;
  } catch (error) {
    console.error('Failed to fetch orders by store ID:', error);
    return [];
  }
}

export async function getOrderItems(orderId: string) {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) {
      console.error('Failed to fetch order items:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch order items:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Failed to update order status:', error);
    }

    return true;
  } catch (error) {
    console.error("unable to update order status", error);
  }
}