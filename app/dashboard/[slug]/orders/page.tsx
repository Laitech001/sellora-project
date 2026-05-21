import { OrderCard, OrderTable } from '@/components/dashboard/order'
import { getOrdersBySlug } from '@/lib/data/Orders'
import { Card } from '@/ui'

type ParamsProps = {
  params: Promise<{
    slug: string;
  }>
}

export default async function OrderPage({ params }: ParamsProps) {
  const { slug } = await params;
  const orders = await getOrdersBySlug(slug);

  console.log('Orders page slug:', slug);
  console.log('Orders page orders:', orders);

  return (
    <div className='bg-white border border-gray-200 rounded-md p-2 m-2'>

      <Card className='flex flex-col justify-left p-4 bg-gray-50 border border-gray-200 rounded-lg mb-2'>
        <h1 className="text-2xl font-bold text-gray-800">
          Orders
        </h1>
        <p className="text-sm text-gray-500">
          Track and manage customer orders
        </p>
      </Card>

      <section className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden'>
        {
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))
        }
      </section>

      <section className='hidden lg:block'>
        <OrderTable orders={orders} />
      </section>
      
    </div>
  )
}