"use client"
import { LineChart, CartesianGrid, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Order = {
  id: string;
  customer_name: string;
  customer_number: number;
  total_price: number;
  total_items: number;
  total_quantity: number;
  status: string;
  created_at: string;
}

export default function Saleschart({ orders }: { orders: Order[] }) {
  // Process orders data for the chart
  const chartData = orders.reduce((acc: any[], order) => {
    const date = new Date(order.created_at).toLocaleDateString();
    const existing = acc.find(item => item.name === date);
    if (existing) {
      existing.sales += order.total_price;
    } else {
      acc.push({ name: date, sales: order.total_price });
    }
    return acc;
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₦${(value / 1000).toFixed(1)}K`;
    return `₦${value}`;
  };

  return (
    <div className="w-auto h-auto p-4 rounded-xl mb-6">
      <h2 
        className="text-lg font-semibold mb-4"
      >
        Sales Overview
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={chartData}
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}  
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}