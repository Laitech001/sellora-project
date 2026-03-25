type DashboardCardProps = {
  icon: React.ElementType,
  title: string,
  value: number,
  color: string
}

export default function DashboardStatsCard({ icon: Icon, title, value, color}: DashboardCardProps) {
  return (
    <div className={`rounded-lg p-5 text-white shadow ${color}`}>
      <section className="flex gap-2">
        <Icon />
        <p className="text-md">{title}</p>
      </section>
      <h1 className="text-2xl font-bold mt-2 m-2">{value}</h1>
    </div>
  )
}