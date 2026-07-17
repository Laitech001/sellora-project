import EmptyState from '@/components/shared/EmptyState';
import { OrderCardList, OrderTable } from '@/components/dashboard/order';
import { getOrdersBySlug } from '@/lib/data/Orders';
import { Card } from '@/ui';
import { ShoppingCart } from 'lucide-react';

type ParamsProps = {
  params: Promise<{
    slug: string;
  }>
}

export default async function OrderPage({ params }: ParamsProps) {
  const { slug } = await params;
  const orders = await getOrdersBySlug(slug);

  return (
    <div className='bg-card border border-slate-500 rounded-md p-2'>

      <Card className='flex flex-col justify-left p-4 bg-card border border-slate-500 rounded-lg mb-2'>
        <h1 className="text-2xl font-bold text-gray-200">
          Orders
        </h1>
        <p className="text-sm text-gray-200">
          Track and manage customer orders
        </p>
      </Card>

      {
        orders && orders.length > 0 ? (
          <>
            <div>
            <OrderCardList orders={orders} slug={slug}/>
            </div>

            <div className='hidden lg:block'>
              <OrderTable orders={orders} slug={slug} />
            </div>
          </>      
        ) : (
          <section className="flex flex-col justify-center items-center h-[calc(100vh-100px)]">
            <EmptyState
              icon={<ShoppingCart size={50} className="text-primary-500" />}
              title="No Orders Yet"
              description="Orders from your customers will appear here."
            />
          </section>
        )
      }      
    </div>
  )
}