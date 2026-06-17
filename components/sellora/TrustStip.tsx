import { Users, Banknote, Star, Clock } from 'lucide-react';

const trustItems = [
  { icon: Users, text: "Trusted by 3,000+ store owners" },
  { icon: Banknote, text: "₦2.4B+ in sales processed" },
  { icon: Star, text: "4.9 / 5 average rating" },
  { icon: Clock, text: "Set up in under 5 minutes" },
];

export default function TrustStrip() {
  return (
    <div className="border-t border-b border-white/8 px-12 py-4 flex items-center justify-center gap-10 flex-wrap max-sm:px-5 max-sm:gap-5 max-sm:flex-col max-sm:items-start">
      {trustItems.map((item) => (
        <div key={item.text} className="flex items-center gap-2 text-sm text-text-secondary">
          <item.icon className='text-primary-400' size={16}/>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}