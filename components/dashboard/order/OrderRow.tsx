import { Button } from '@/ui'
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
  onChange: (orderId: string, status: string) => void
}

export default function OrderRow({ order, onChange }: orderProps) {

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-600",
    processing: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-600",
    cancelled: "bg-red-100 text-red-600",
  };

  const getOrdinal = (day: any) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };
  
  return (
    <tr 
      className="text-left border-b border-slate-500 p-2 hover:bg-gray-100 transition"
    >
      <td className="py-3 font-semibold">{order.customer_name}</td>
      <td className='text-gray-500'>{order.customer_number}</td>
      <td>{order.total_items} items</td>
      <td className="font-semibold text-gray-800">{formatPrice(order.total_price)}</td>
      <td>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            statusStyles[order.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {order.status}
        </span>
      </td>
      <td>{order.total_quantity}</td>
      <td>{formatDate(order.created_at)}</td>
      <td>
        <select
          value={order.status}
          className='cursor-pointer border border-gray-200 rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          onChange={(e) => onChange(order.id, e.target.value)}
        >
          <option value='pending'>pending</option>
          <option value='processing'>processing</option>
          <option value='delivered'>delivered</option>
          <option value='cancelled'>cancelled</option>
        </select>
      </td>
    </tr>
  )
}