import { Package, ShoppingCart, DollarSign, Clock } from "lucide-react"

export async function getstats() {
  return [
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
}