"use client";
import { BrandLogoName } from "@/ui/Brand";
import { Utensils } from "lucide-react";
import Link from 'next/link'

export default function Navbar() {

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-12 h-16 bg-dark/85 backdrop-blur-xl border-b border-white/8">

      <BrandLogoName />

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        {navLinks.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-text-secondary text-sm no-underline hover:text-white transition-colors duration-200"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <Link 
          href={'/signup'}
          className="px-4.5 py-2 rounded-lg text-[13px] font-medium text-content bg-transparent border border-white/[0.14] hover:bg-white/5 transition-all duration-200 cursor-pointer"
        >
          Log in
        </Link>

        <Link
          href={'/signup'}
          className="px-4.5 py-2 rounded-lg text-[13px] font-medium text-white bg-linear-to-br from-primary-600 to-accent-600 hover:opacity-90 transition-opacity duration-200 cursor-pointer"
        >
          Start free
        </Link>
      </div>
    </nav>
  );
}
