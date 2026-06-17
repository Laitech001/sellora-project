export default function Footer() {
  return (
    <footer className="px-12 py-6 border-t border-white/8 flex items-center justify-between flex-wrap gap-4 max-sm:px-5 max-sm:flex-col max-sm:items-start">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-[7px] bg-linear-to-br from-[#7c3aed] to-[#db2777] flex items-center justify-center text-[12px] font-bold text-white font-display">
          S
        </div>
        <span className="text-[13px] text-white/40">© 2026 Sellora. All rights reserved.</span>
      </div>

      <div className="flex gap-6">
        {["Privacy", "Terms", "Support", "Twitter"].map((link) => (
          <a
            key={link}
            href="#"
            className="text-[13px] text-white/30 no-underline hover:text-white/60 transition-colors duration-200"
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}