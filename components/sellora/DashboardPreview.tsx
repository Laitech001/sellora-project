import { 
  Circle,
  Smartphone,
  Headphones,
  Footprints,
} from 'lucide-react'

const stats = [
  { label: "Total revenue", value: "₦482k", badge: "+12%", badgeType: "green" },
  { label: "Orders", value: "134", badge: "+8%", badgeType: "green" },
  { label: "Products", value: "56", badge: "3 low stock", badgeType: "amber" },
  { label: "Customers", value: "91", badge: "+5 this week", badgeType: "green" },
];

const orders = [
  {
    name: "iPhone 13 128GB",
    id: "#1042",
    amount: "₦185,000",
    status: "Fulfilled",
    statusType: "green",
    iconBg: "bg-[rgba(124,58,237,0.18)]",
    iconColor: "text-[#a78bfa]",
    icon: Smartphone,
  },
  {
    name: "AirPods Pro",
    id: "#1041",
    amount: "₦78,000",
    status: "Pending",
    statusType: "amber",
    iconBg: "bg-[rgba(219,39,119,0.14)]",
    iconColor: "text-[#f9a8d4]",
    icon: Headphones,
  },
  {
    name: "Nike Air Force 1",
    id: "#1040",
    amount: "₦54,000",
    status: "Fulfilled",
    statusType: "green",
    iconBg: "bg-[rgba(29,158,117,0.14)]",
    iconColor: "text-[#5DCAA5]",
    icon: Footprints,
  },
];

const badgeStyles = {
  green: "bg-[rgba(29,158,117,0.15)] text-[#5DCAA5]",
  amber: "bg-[rgba(186,117,23,0.15)] text-[#FAC775]",
};

export default function DashboardPreview() {
  return (
    <section className="px-12 py-18 max-sm:px-5">
      <p className="text-center text-[11px] tracking-[0.12em] text-text-secondary uppercase mb-3">
        Your command centre
      </p>
      <h2 className="text-center text-[clamp(26px,3vw,36px)] font-bold font-display text-white tracking-[-0.02em] mb-12">
        Everything you need, right in front of you
      </h2>

      {/* Frame */}
      <div className="max-w-190 mx-auto bg-card border border-white/8 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(124,58,237,0.1)]">
        {/* Browser chrome */}
        <div className="bg-[#0c1526] px-5 py-3 flex items-center gap-2.5 border-b border-white/8">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-white/20">Sellora Dashboard</span>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[15px] font-semibold text-white font-display">Laitech Store</p>
              <p className="flex items-center gap-1 text-xs text-text-secondary mt-0.5">Dashboard overview <span><Circle size={10} className='filled'/></span> Today</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[rgba(29,158,117,0.15)] text-[#5DCAA5]">
              <span className="text-[8px]">●</span> Live
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-5 max-sm:grid-cols-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-circle-background border border-white/8 rounded-xl px-4 py-3.5"
              >
                <p className="text-[11px] text-text-secondary mb-1.5">{s.label}</p>
                <p className="text-xl font-semibold text-white font-display">{s.value}</p>
                <span
                  className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                    badgeStyles[s.badgeType as keyof typeof badgeStyles]
                  }`}
                >
                  {s.badge}
                </span>
              </div>
            ))}
          </div>

          {/* Orders */}
          <div className="border-t border-white/8 pt-4">
            <p className="text-xs text-text-secondary mb-3">Recent orders</p>
            <div className="flex flex-col">
              {orders.map((order, i) => (
                <div
                  key={order.id}
                  className={`flex items-center justify-between py-2.5 ${
                    i > 0 ? "border-t border-white/8" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${order.iconBg} flex items-center justify-center text-sm shrink`}
                    >
                      <order.icon />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-white">{order.name}</p>
                      <p className="text-[11px] text-text-secondary">Order {order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-medium text-white">{order.amount}</p>
                    <span
                      className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-medium ${
                        badgeStyles[order.statusType as keyof typeof badgeStyles]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
