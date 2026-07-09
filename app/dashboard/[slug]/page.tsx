import { getOrdersBySlug, getRecentOrders } from "@/lib/data/Orders";
import { getstats } from "@/lib/data/Stats"
import DashboardStatsCard from "../../../components/dashboard/others/DashboardStatsCard"
import Saleschart from "../../../components/dashboard/others/Saleschart"
import { OrderCardList, OrderTable} from '@/components/dashboard/order'
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

      <div className="bg-card m-2 rounded-xl">
        <Saleschart orders={orders}/>
      </div>

      <div className="p-6 m-2 mt-4 bg-card border border-slate-500 shadow-md rounded-xl">
        
        <Card className="flex justify-between items-center bg-card border border-slate-500 rounded p-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-200">
            Recent Orders
          </h2>

          <Link
            href='/dashboard/orders'
            className='py-2 px-3 bg-linear-to-r from-primary-500 to-accent-500 text-white rounded-lg text-md transition'
          >
            View All
          </Link>
        </Card>

        {/* mobile recent order layout */}
        <section>
          <OrderCardList orders={orders} slug={slug} />
        </section>

        {/* desktop recent order layout */}
        <section className="hidden lg:block">
          <OrderTable orders={recentOrders} slug={slug} />
        </section> 
      </div>

    </>
  )
}