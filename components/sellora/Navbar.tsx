"use client";

import { useState } from "react";
import { BrandLogoName } from "@/ui/Brand";
import Link from 'next/link'
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#howItWorks" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "FAQ", href: "#faq" },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-12 h-16 bg-dark/85 backdrop-blur-xl border-b border-white/8">

        <BrandLogoName />

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

        <div className="hidden md:flex items-center gap-2.5">
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

        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="flex md:hidden items-center justify-center w-9 h-9 -mr-1.5 rounded-lg text-content hover:bg-white/5 active:bg-white/10 transition-colors duration-200 cursor-pointer"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          <Menu size={22} />
        </button>
      </nav>

      <div
        onClick={closeMenu}
        className={`md:hidden fixed inset-0 z-60 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`md:hidden fixed top-0 right-0 z-70 h-dvh w-[82%] max-w-75 bg-card border-l border-white/8 shadow-2xl shadow-black/40 transition-transform duration-300 ease-out flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/8 shrink">
          <BrandLogoName />
          <button
            type="button"
            onClick={closeMenu}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-content hover:bg-white/5 active:bg-white/10 transition-colors duration-200 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="flex flex-col gap-1 list-none px-3 py-4 overflow-y-auto">
          {navLinks.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={closeMenu}
                className="block px-3 py-3 rounded-lg text-content text-[15px] no-underline hover:bg-white/5 active:bg-white/10 transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth actions pinned to bottom via mt-auto + flex-col parent,
            not absolute positioning, so they never overlap long link lists. */}
        <div className="flex flex-col gap-2.5 px-4 py-5 mt-auto border-t border-white/8 shrink">
          <Link
            href={'/signup'}
            onClick={closeMenu}
            className="w-full text-center px-4.5 py-2.5 rounded-lg text-sm font-medium text-content bg-transparent border border-white/[0.14] hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            Log in
          </Link>

          <Link
            href={'/signup'}
            onClick={closeMenu}
            className="w-full text-center px-4.5 py-2.5 rounded-lg text-sm font-medium text-white bg-linear-to-br from-primary-600 to-accent-600 hover:opacity-90 transition-opacity duration-200 cursor-pointer"
          >
            Start free
          </Link>
        </div>
      </aside>
    </>
  );
}