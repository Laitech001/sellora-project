const steps = [
  {
    title: "Create your free account",
    desc: "Sign up with your email in under 60 seconds. No credit card, no setup fees, no surprises.",
  },
  {
    title: "Add your products and prices",
    desc: "Upload product photos, write descriptions, and set your prices. Your store is ready to share immediately.",
  },
  {
    title: "Start selling and watch it grow",
    desc: "Share your store link on WhatsApp, Instagram, or direct. Every sale, order, and customer tracked automatically.",
  },
];

export default function HowItWorks() {
  return (
    <section id="howItWorks" className="px-12 py-20 bg-[linear-gradient(180deg,transparent,rgba(124,58,237,0.06)_50%,transparent)] max-sm:px-5">
      <div className="max-w-150 mx-auto">
        <p className="text-center text-[11px] tracking-[0.12em] text-text-secondary uppercase mb-2.5">
          How it works
        </p>
        <h2 className="text-center text-[clamp(26px,3vw,36px)] font-bold font-display text-white tracking-[-0.02em] mb-12">
          Live in minutes, not days
        </h2>

        <div className="flex flex-col">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-5">
              {/* Left: number + connector line */}
              <div className="flex flex-col items-center shrink">
                <div className="w-9.5 h-9.5 rounded-full bg-linear-to-br from-primary-600 to-accent-600 flex items-center justify-center text-[14px] font-semibold text-white font-display shrink">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 min-h-9 bg-linear-to-b from-[rgba(124,58,237,0.5)] to-[rgba(124,58,237,0.08)] my-1.5" />
                )}
              </div>

              {/* Content */}
              <div className={`pt-1 ${i < steps.length - 1 ? "pb-10" : "pb-0"}`}>
                <h3 className="text-[16px] font-semibold text-white font-display mb-1.5">
                  {step.title}
                </h3>
                <p className="text-[14px] text-text-secondary leading-[1.7]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
