import { getOrdersBySlug, getRecentOrders } from "@/lib/data/Orders";
import { getstats } from "@/lib/data/Stats"
import DashboardStatsCard from "../../../components/dashboard/others/DashboardStatsCard"
import Saleschart from "../../../components/dashboard/others/Saleschart"
import { OrderCard, OrderTable} from '@/components/dashboard/order'
import Link from "next/link";
import { Card } from '@/ui';
import { Package, ShoppingCart, DollarSign, Clock} from 'lucide-react'

type ParamsPprops = {
  params: Promise<{
    slug: string;
  }>
}

export default async function Dashboard({ params }: ParamsPprops) {
  const { slug } = await params;

  console.log('Dashboard slug:', slug);

  const orders = await getOrdersBySlug(slug);
  const recentOrders = await getRecentOrders(slug);

  let stats = {
    totalProducts: 0, 
    totalOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
  };

  try {
    stats = await getstats(slug);
  } catch (error) {
    console.error('Dashboard failed to load stats:', error);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const statsArray = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package
    }, {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart
    }, {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock
    }, {
      title: 'Total Sales',
      value: formatPrice(stats.totalSales),
      icon: DollarSign
    }
  ];

  return (
    <>
      <div 
        className="fixed top-0 left-2 z-50 p-2 text-white text-sm bg-red-500 hidden md:bg-blue-500 lg:bg-green-500 xl:bg-yellow-500"
      >
        breakpoint test
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-2">
        {
          statsArray.map(stat => (
            <DashboardStatsCard
              key={stat.title}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
            />
          ))
        }
      </div>

      <div className="m-2 bg-white border border-gray-200 shadow-md rounded-xl">
        <Saleschart orders={orders}/>
      </div>

      <div className="p-6 m-2 mt-4 bg-white border border-gray-200 shadow-md rounded-xl">

        <Card className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Orders
          </h2>

          <Link
            href='/dashboard/orders'
            className='py-2 px-3 bg-blue-500 text-white border border-blue-500 rounded-lg text-md hover:bg-white hover:text-blue-600 transition'
          >
            View All
          </Link>
        </Card>

        {/* mobile recent order layout */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
          {
            recentOrders.map(order => (
              <OrderCard
                key={order.id} 
                order={order}
              />
            ))
          }
        </section>

        {/* desktop recent order layout */}
        <section className="hidden lg:block">
          <OrderTable orders={recentOrders} />
        </section> 
      </div>

    </>
  )
}