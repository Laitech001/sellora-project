'use client'

import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from 'next/navigation';


export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden px-12 pt-24 pb-20 text-center max-sm:px-5">
      {/* Glows */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-174 h-125 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.28)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 w-100 h-75 bg-[radial-gradient(ellipse_at_center,rgba(219,39,119,0.13)_0%,transparent_70%)]" />

      <div className="relative max-w-170 mx-auto">
        {/* Pill */}
        <span className="inline-flex items-center gap-1.5 bg-[rgba(124,58,237,0.15)] text-primary-300 border border-[rgba(124,58,237,0.28)] rounded-full px-3.5 py-1.25 text-xs font-medium tracking-[0.01em]">
          <Sparkles size={16} /> <span>Built for Nigerian store owners</span>
        </span>

        {/* Heading */}
        <h1 className="mt-5 mb-5 text-[clamp(38px,5vw,58px)] font-bold font-display text-white leading-[1.08] tracking-[-0.03em]">
          Your entire store.{" "}
          <span className="bg-linear-to-br from-primary-600 to-accent-600 bg-clip-text text-transparent">
            One dashboard.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-[17px] text-text-secondary max-w-115 mx-auto mb-9 leading-[1.75]">
          Sellora gives you everything you need to sell online — track orders,
          manage products, collect payments, and watch your business grow in real
          time.
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => {router.push('/signup')}} 
            className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-[10px] text-[15px] font-medium text-white bg-lineear-to-br from-primary-600 to accent-accent-600 hover:opacity-90 active:scale-[0.97] transition-all duration-200 cursor-pointer"
          >
            Create your store free
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-[10px] text-[15px] font-medium text-content bg-transparent border border-white/[0.14] hover:bg-white/5 active:scale-[0.97] transition-all duration-200 cursor-pointer">
            See how it works
          </button>
        </div>

        {/* Note */}
        <p className="mt-3.5 text-xs text-white/30 flex items-center justify-center gap-1.5">
          <ShieldCheck size={16} className="text-primary-600" />
          No credit card required — free to start
        </p>
      </div>
    </section>
  );
}
