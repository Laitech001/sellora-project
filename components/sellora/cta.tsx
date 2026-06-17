'use client'

import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation';

export default function CTA() {
  const router = useRouter();

  return (
    <section className="px-12 py-20 max-sm:px-5">
      <div className="max-w-170 mx-auto relative overflow-hidden bg-[linear-gradient(135deg,rgba(124,58,237,0.2),rgba(219,39,119,0.14))] border border-[rgba(124,58,237,0.28)] rounded-[20px] px-12 py-15 text-center max-sm:px-6 max-sm:py-9">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-15 left-1/2 -translate-x-1/2 w-100 h-65 bg-[radial-gradient(ellipse,rgba(124,58,237,0.2)_0%,transparent_70%)]" />

        <h2 className="relative text-[clamp(26px,3vw,38px)] font-bold font-display text-white tracking-[-0.025em] mb-3.5">
          Ready to grow your business?
        </h2>
        <p className="relative text-[15px] text-text-secondary leading-[1.75] mb-8 max-w-115 mx-auto">
          Join thousands of store owners who use Sellora to sell smarter, track
          everything, and spend less time on admin.
        </p>
        <div className="relative flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => {router.push('/signup')}} 
            className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-[10px] text-[15px] font-medium text-white bg-linear-to-br from-primary-600 to-accent-600 hover:opacity-90 active:scale-[0.97] transition-all duration-200 cursor-pointer"
          >
            Create your store free <span aria-hidden="true"><ArrowRight size={16}/></span>
          </button>
        </div>
      </div>
    </section>
  );
}
