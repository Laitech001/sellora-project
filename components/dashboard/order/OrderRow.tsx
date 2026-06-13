import { ViewDetailsButton } from '../../actions';

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
  onClick: (orderId: string) => void
}

export default function OrderRow({ order, onClick }: orderProps) {

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    processing: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    delivered: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    cancelled: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
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
      key={order.id} 
      className="align-middle text-left border-b border-slate-500 p-2 hover:bg-slate-800/30 transition-all duration-500"
    >
      <td className="py-3 font-semibold">#{order.id.toString().padStart(4, '0')}</td>

      <td className='flex flex-col gap-1'>
        <p className='text-base text-content'>{order.customer_name}</p>
        <p className='text-sm text-slate-400'>{order.customer_number}</p>
      </td>

      <td className="font-semibold text-content">
        {formatPrice(order.total_price)}
      </td>

      <td>
        <span
          className={`text-sm px-3 py-1 rounded-md ${
            statusStyles[order.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {order.status}
        </span>
      </td>

      <td>{formatDate(order.created_at)}</td>

      <td>
        <div className='relative group'>
          <ViewDetailsButton 
            onClick={() => onClick(order.id)} 
          />

          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md border border-gray-700 opacity-0 group-hover:opacity-100 transition">
            View details
          </span>
        </div>
      </td>
    </tr>
  )
}