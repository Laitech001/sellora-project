import { Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      "Before Sellora, I was tracking everything in a notebook. Now I can see my sales in real time and I've not missed a single order since I joined.",
    name: "Adaeze Okonkwo",
    role: "Fashion store, Lagos",
    initials: "AO",
  },
  {
    quote:
      "The inventory alerts alone saved me twice already. I used to run out of stock without knowing. Now I restock before it even becomes a problem.",
    name: "Tunde Ibrahim",
    role: "Electronics reseller, Abuja",
    initials: "TI",
  },
  {
    quote:
      "My customers love having a proper store link they can share. Sales doubled in the first month after I moved everything to Sellora.",
    name: "Ngozi Eze",
    role: "Beauty products, Port Harcourt",
    initials: "NE",
  },
];

export default function Testimonials() {
  return (
    <section className="px-12 py-20 max-sm:px-5">
      <p className="text-center text-[11px] tracking-[0.12em] text-text-secondary uppercase mb-2.5">
        What store owners say
      </p>
      <h2 className="text-center text-[clamp(26px,3vw,36px)] font-bold font-display text-white tracking-[-0.02em] mb-12">
        Real results, real people
      </h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 max-w-215 mx-auto">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-card border border-white/8 rounded-2xl p-6"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-3.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-primary-400 text-[15px]"><Star size={14}/></span>
              ))}
            </div>

            <p className="text-[14px] text-content leading-[1.75] mb-5">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="flex items-center gap-2.5">
              <div className="w-8.5 h-8.5 rounded-full bg-circle-background border border-[rgba(124,58,237,0.25)] flex items-center justify-center text-xs font-semibold text-primary-300 shrink">
                {t.initials}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">{t.name}</p>
                <p className="text-[12px] text-text-secondary">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
