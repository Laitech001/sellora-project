import { getRecentOrders } from "@/lib/data/Orders";
import DashboardStatsCard from "./components/DashboardStatsCard"
import Saleschart from "./components/Saleschart"
import { getstats } from "@/lib/data/Stats"
import OrderCard from "./components/OrderCard";
import OrderRow from "./components/OrderRow";
import Table from "./components/Table";


export default async function Dashboard() {
  const stats = await getstats();
  const Orders = await getRecentOrders();

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
        {stats.map((stat, index) => (
          <DashboardStatsCard 
            key= {index}
            title= {stat.title}
            icon={stat.icon}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      <Saleschart />

      <div className="p-6 m-2 mt-4 border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Orders
          </h2>

          <button className="text-sm text-white bg-blue-600 p-2 border border-blue-600 rounded-lg hover:bg-white hover:text-blue-600">
            View All
          </button>
        </div>

        {/* mobile recent order layout */}
        {Orders.map(order => (
          <OrderCard
            key={order.id}
            id={order.id} 
            customer= {order.customer}
            product= {order.product}
            price= {order.price}
            status= {order.status}
            date= {order.date}
          />
        ))}

        {/* desktop recent order layout */}
        <section className="hidden md:block">
          <Table>
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-300 py-4">
                <th className="py-3">Customer</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {Orders.map(order => (
                <OrderRow
                  key={order.id} 
                  customer= {order.customer}
                  product= {order.product}
                  price= {order.price}
                  status= {order.status}
                  date= {order.date}
                />
              ))}
            </tbody>
          </Table>
        </section> 

      </div>

    </>
  )
}