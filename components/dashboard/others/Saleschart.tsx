"use client"

import { Card } from "@/ui";
import {
  LineChart,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";

type Order = {
  id: string;
  customer_name: string;
  customer_number: number;
  total_price: number;
  total_items: number;
  total_quantity: number;
  status: string;
  created_at: string;
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-circle-background border border-border-soft rounded-lg px-4 py-3 shadow-xl shadow-black/30">
      <p className="text-text-secondary text-xs mb-1">{label}</p>
      <p className="text-content text-sm font-semibold">
        Sales:{" "}
        <span className="text-primary-400">
          ₦{payload[0].value.toLocaleString()}
        </span>
      </p>
    </div>
  );
}

export default function Saleschart({ orders }: { orders: Order[] }) {
  // Process orders data for the chart
  const chartData = orders.reduce((acc: any[], order) => {
    const date = new Date(order.created_at).toLocaleDateString();
    const existing = acc.find((item) => item.name === date);
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

  const hasData = chartData.length > 0;
  const totalSales = chartData.reduce((sum, d) => sum + d.sales, 0);

  return (
    <Card className="w-auto h-auto p-4 sm:p-6 mb-6 bg-card border border-border-soft">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <h2 className="text-content text-base sm:text-lg font-semibold font-display">
          Sales Overview
        </h2>
        {hasData && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-300 bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.25)] rounded-full px-2.5 py-1">
            <TrendingUp size={12} />
            {formatCurrency(totalSales)} total
          </span>
        )}
      </div>
      <p className="text-text-secondary text-xs sm:text-sm mb-5">
        Daily revenue from confirmed orders
      </p>

      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.08)"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            />

            <YAxis
              tickFormatter={formatCurrency}
              stroke="rgba(255,255,255,0.08)"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={64}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(124,58,237,0.35)", strokeWidth: 1 }}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="url(#salesLineGradient)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#a78bfa", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#a78bfa", stroke: "#0f172a", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        // ── Empty state ──
        <div className="flex flex-col items-center justify-center text-center py-16 px-4">
          <div className="w-14 h-14 rounded-2xl bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.2)] flex items-center justify-center mb-4">
            <BarChart3 size={24} className="text-primary-400" />
          </div>
          <h3 className="text-content text-sm font-semibold font-display mb-1.5">
            No sales yet
          </h3>
          <p className="text-text-secondary text-xs sm:text-sm max-w-65 leading-relaxed">
            Your sales chart will appear here as soon as you receive your first order.
          </p>
        </div>
      )}
    </Card>
  );
}