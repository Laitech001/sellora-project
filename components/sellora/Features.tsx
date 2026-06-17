import { 
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  Store,
} from 'lucide-react';


const features = [
  {
    icon: BarChart3,
    title: "Sales analytics",
    desc: "See revenue trends, top products, and daily growth without opening a single spreadsheet.",
  },
  {
    icon: ShoppingCart,
    title: "Order management",
    desc: "View, fulfill, and update every order from one clean interface. No more lost orders.",
  },
  {
    icon: Package,
    title: "Inventory control",
    desc: "Get low-stock alerts automatically. Manage variants and never oversell again.",
  },
  {
    icon: Users,
    title: "Customer records",
    desc: "Full purchase history and contact details for every customer you've ever sold to.",
  },
  {
    icon: CreditCard,
    title: "Payments & payouts",
    desc: "Accept card, transfer, and USSD payments. Get paid directly to your bank account.",
  },
  {
    icon: Store,
    title: "Your own storefront",
    desc: "A public store link customers can browse and buy from — no developer needed.",
  },
];

export default function Features() {
  return (
    <section id='features' className="px-12 py-20 max-sm:px-5">
      <p className="text-center text-[11px] tracking-[0.12em] text-text-secondary uppercase mb-2.5">
        Everything your business needs
      </p>
      <h2 className="text-center text-[clamp(26px,3vw,36px)] font-bold font-display text-white tracking-[-0.02em] mb-2">
        Built for serious store owners
      </h2>
      <p className="text-center text-[15px] text-text-secondary max-w-105 mx-auto mb-14 leading-[1.7]">
        Stop juggling spreadsheets and WhatsApp screenshots. Sellora puts your
        whole operation in one place.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-w-215 mx-auto">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-card border border-white/9 rounded-2xl p-6 transition-all duration-200 hover:border-[rgba(124,58,237,0.35)] hover:-translate-y-0.5 group"
          >
            <div className="w-11 h-11 rounded-[11px] bg-[rgba(124,58,237,0.18)] border border-[rgba(124,58,237,0.28)] flex items-center justify-center text-xl mb-4">
              <f.icon className='text-primary-400'/>
            </div>
            <h3 className="text-[15px] font-semibold text-white font-display mb-2">
              {f.title}
            </h3>
            <p className="text-[13px] text-text-secondary leading-[1.7]">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
