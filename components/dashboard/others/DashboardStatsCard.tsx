import { Card } from '@/ui';
import { LucideIcon } from 'lucide-react';
type DashboardCardProps = {
  title: string,
  value: number | string,
  icon: LucideIcon,
  className?: string
}

export default function DashboardStatsCard({ title, value, icon: Icon}: DashboardCardProps) {

  return (
    <Card className={'bg-white border border-gray-200 shadow-md rounded-xl'}>
      <section className="flex gap-2">
        <Icon size={18} />
        <p className="text-gray-500 text-sm">{title}</p>
      </section>
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{value}</h1>
    </Card>
  )
}