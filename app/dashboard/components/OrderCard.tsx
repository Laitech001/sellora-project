type OrderCardProps = {
  id: number,
  customer: string,
  product: string,
  price: number,
  status: string,
  date: string
}

export default function RecentOrderCard({id, customer, product, price, status, date}: OrderCardProps) {
  return (
    <>
      {/* Mobile layout */}
      <div
        className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 md:hidden"
      >
        <div className="font-semibold text-gray-800">
          {customer}
        </div>

        <div className="text-sm text-gray-500">
          {product}
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">
            ₦{price}
          </span>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              status === "completed"
                ? "bg-green-100 text-green-600"
                : status === "pending"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="text-xs text-gray-400">
          {date}
        </div>
      </div>
    </>
    
  )
}