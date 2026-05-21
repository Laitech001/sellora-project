type orderProps = {
  order: {
    id: string;
    customer_name: string;
    customer_number: number;
    total_price: number;
    total_items: number;
    total_quantity: number;
    status: string;
    created_at: string;
  }
}

export default function RecentOrderCard({ order }: orderProps) {

  // function to get ordinal suffix for date
   const getOrdinal = (day: any) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  // format date code
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);

    const day = date.toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      day: "numeric",
    });

    const monthYear = date.toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      month: "long",
      year: "numeric",
    });

    const time = date.toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${day}${getOrdinal(Number(day))} ${monthYear}, ${time}`;
  };

  // format price code
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };


  return (
    <>
      {/* Mobile layout */}
      <div
        className="bg-gray-50 border border-gray-200 rounded-xl shadow p-4 flex flex-col gap-2"
      >
        <div className="font-semibold text-gray-800">
          {order.customer_name}
        </div>

        <div className="text-sm text-gray-500">
          {order.customer_number}
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">
            {formatPrice(order.total_price)}
          </span>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              order.status === "completed"
                ? "bg-green-100 text-green-600"
                : order.status === "pending"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="text-xs text-gray-400">
          {formatDate(order.created_at)}
        </div>
      </div>
    </>
    
  )
}