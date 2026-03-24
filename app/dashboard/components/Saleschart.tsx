"use client"
import { LineChart, CartesianGrid, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", sales: 200 },
  { name: "Tue", sales: 350 },
  { name: "Wed", sales: 150 },
  { name: "Thu", sales: 500 },
  { name: "Fri", sales: 420 },
];

export default function Saleschart() {
  return (
    <div className="w-full h-80 p-4 rounded-xl mb-6">
      <h2 
        className="text-lg font-semibold mb-4"
      >
        Sales Overview
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}