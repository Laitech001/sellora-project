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
    <Card className=' flex items-center gap-2 shadow-md p-2'>

      <section className='p-3 bg-circle-background border border-slate-500 rounded-full w-max mb-4'>
        <Icon size={18} className='text-primary-500' />
      </section>

      <section>
        <p className="text-gray-200 text-sm">{title}</p>
        <h1 className="text-gray-200 text-xl md:text-2xl font-semibold">{value}</h1>
      </section>
    </Card>
  )
}