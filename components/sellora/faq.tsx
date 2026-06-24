"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

const faqs = [
  {
    q: "Do I need a website?",
    a: "No. Sellora gives you a ready-made storefront the moment you sign up. No domain, hosting, or web developer required. Just add your products and share your store link.",
  },
  {
    q: "How do customers place orders?",
    a: "Customers visit your Sellora store link, browse your products, and check out directly. No app download or account creation needed on their end. Every order lands straight in your dashboard.",
  },
  {
    q: "Do I need technical skills?",
    a: "Not at all. If you can use WhatsApp or Instagram, you can run a Sellora store. Adding products, setting prices, and managing orders is all point-and-click.",
  },
  {
    q: "Is online payment available, and is it safe?",
    a: "Not yet. Currently, customers place orders through your storefront and continue the conversation on WhatsApp with the seller. This allows buyers to ask questions, confirm details, and build trust before making any payment arrangements. Secure online payments are planned for a future release.",
  },
  {
    q: "What if I get stuck or have a question?",
    a: "Our support team is reachable directly from your dashboard. Since we're early, you'll be talking to real people building the product not a ticket queue.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="px-12 py-20 max-sm:px-5">
      <p className="text-center text-[11px] tracking-[0.12em] text-text-secondary uppercase mb-2.5">
        Got questions?
      </p>
      <h2 className="text-center text-[clamp(26px,3vw,36px)] font-bold font-display text-white tracking-[-0.02em] mb-2">
        Frequently asked questions
      </h2>
      <p className="text-center text-[15px] text-text-secondary max-w-110 mx-auto mb-12 leading-[1.7]">
        We're new, so we know you have questions. Here's what store owners
        ask us most.
      </p>

      <div className="max-w-160 mx-auto flex flex-col gap-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.q}
              className="bg-card border border-white/8 rounded-2xl overflow-hidden transition-colors duration-200 hover:border-[rgba(124,58,237,0.25)]"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-[15px] font-medium text-white font-display">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-text-secondary shrink transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-200 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-[14px] text-text-secondary leading-[1.75]">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust note */}
      <div className="max-w-160 mx-auto mt-8 flex items-center justify-center gap-2 text-center">
        <ShieldCheck size={15} className="text-primary-400 shrink" />
        <p className="text-[13px] text-text-secondary">
          Payments are held securely until orders are confirmed — for buyers and sellers.
        </p>
      </div>
    </section>
  );
}