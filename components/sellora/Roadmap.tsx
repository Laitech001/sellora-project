import { CheckCircle2, Loader2, CircleDashed } from "lucide-react";

const roadmap = [
  {
    quarter: "Q3 2026",
    status: "in-progress",
    title: "Public launch & storefronts",
    items: [
      "Store creation & product catalog",
      "Order & inventory dashboard",
      "Secure card, transfer & USSD payments",
    ],
  },
  {
    quarter: "Q4 2026",
    status: "planned",
    title: "Grow & get paid faster",
    items: [
      "Same day payouts",
      "Discount codes & bundle pricing",
      "WhatsApp order notifications",
    ],
  },
  {
    quarter: "Q1 2027",
    status: "planned",
    title: "Scale across channels",
    items: [
      "Instagram & marketplace integrations",
      "Multi-staff store accounts",
      "Customer loyalty & repeat-order tools",
    ],
  },
  {
    quarter: "Q2 2027",
    status: "planned",
    title: "Sellora for bigger teams",
    items: [
      "Multi-store management",
      "Advanced analytics & exports",
      "API access for custom integrations",
    ],
  },
];

const statusConfig = {
  "in-progress": {
    label: "In progress",
    Icon: Loader2,
    badgeClass: "bg-[rgba(124,58,237,0.18)] text-[#c4b5fd]",
    dotClass: "bg-gradient-to-br from-[#7c3aed] to-[#db2777]",
  },
  planned: {
    label: "Planned",
    Icon: CircleDashed,
    badgeClass: "bg-[#1E293B] text-[#94a3b8]",
    dotClass: "bg-[#1E293B] border border-white/[0.14]",
  },
  shipped: {
    label: "Shipped",
    Icon: CheckCircle2,
    badgeClass: "bg-[rgba(29,158,117,0.15)] text-[#5DCAA5]",
    dotClass: "bg-[#5DCAA5]",
  },
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="px-12 py-20 max-sm:px-5">
      <p className="text-center text-[11px] tracking-[0.12em] text-text-secondary uppercase mb-2.5">
        What's next
      </p>
      <h2 className="text-center text-[clamp(26px,3vw,36px)] font-bold font-display text-white tracking-[-0.02em] mb-2">
        Built in public, shaped by you
      </h2>
      <p className="text-center text-[15px] text-text-secondary max-w-115 mx-auto mb-16 leading-[1.7]">
        We're just getting started. Here's where Sellora is headed and
        early store owners help decide what comes next.
      </p>

      <div className="max-w-180 mx-auto relative">
        {/* Vertical connector line */}
        <div className="absolute left-4.75 top-2 bottom-2 w-px bg-linear-to-b from-[rgba(124,58,237,0.4)] via-[rgba(124,58,237,0.15)] to-transparent max-sm:left-3.75" />

        <div className="flex flex-col gap-10">
          {roadmap.map((phase) => {
            const config = statusConfig[phase.status as keyof typeof statusConfig];
            return (
              <div key={phase.quarter} className="relative flex gap-6 max-sm:gap-4">
                {/* Dot */}
                <div className="relative z-10 shrink">
                  <div
                    className={`w-10 h-10 rounded-full ${config.dotClass} flex items-center justify-center max-sm:w-8 max-sm:h-8`}
                  >
                    <config.Icon
                      size={16}
                      className={phase.status === "in-progress" ? "text-white animate-spin" : phase.status === "planned" ? "text-text-secondary" : "text-white"}
                    />
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 bg-card border border-white/8 rounded-2xl p-6 -mt-0.5">
                  <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                    <span className="text-[13px] font-semibold text-primary-400 font-display tracking-wide">
                      {phase.quarter}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium ${config.badgeClass}`}
                    >
                      {config.label}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-semibold text-white font-display mb-3">
                    {phase.title}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {phase.items.map((item) => (
                      <li
                        key={item}
                        className="text-[13px] text-text-secondary leading-[1.6] flex items-start gap-2"
                      >
                        <span className="text-primary-400 mt-1.5 w-1 h-1 rounded-full bg-current shrink" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}