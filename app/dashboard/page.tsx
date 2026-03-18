import { color } from "motion"
import DashboardCard from "./components/DashboardCard"
import { Package, ShoppingCart, DollarSign, Clock } from "lucide-react"
import Saleschart from "./components/Saleschart"
export default function Dashboard() {
  const DashboardStats = [
    {
      color: 'bg-blue-600',
      title: 'Total Products',
      value: 25,
      icon: Package
    },
    {
      title: "Total Orders",
      value: 15,
      color: "bg-green-500",
      icon: ShoppingCart
    },
    {
      title: "Total Sales",
      value: 40000,
      color: "bg-purple-500",
      icon: DollarSign
    },
    {
      title: "Pending Orders",
      value: 3,
      color: "bg-orange-500",
      icon: Clock
    }
  ]
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
        {DashboardStats.map((stat, index) => (
          <DashboardCard 
            key= {index}
            title= {stat.title}
            icon={stat.icon}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      <Saleschart />
    </>
  )
}