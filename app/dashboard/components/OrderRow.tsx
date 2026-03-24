type OrderRowProps = {
  customer: string,
  product: string,
  price: number,
  status: string,
  date: string
}

export default function OrderRow({customer, product, price, status, date}: OrderRowProps) {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };
  
  return (
    <tr 
      className="text-left border-b border-gray-300  hover:bg-gray-200 transition"
    >
      <td className="py-3">{customer}</td>
      <td>{product}</td>
      <td>{formatPrice(price)}</td>
      <td>
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
      </td>
      <td>{date}</td>
    </tr>
  )
}