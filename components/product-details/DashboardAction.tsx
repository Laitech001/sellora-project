"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, MoreVertical, Copy, Archive, BarChart3 } from "lucide-react";

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onViewAnalytics?: () => void;
};

export default function DashboardActions({
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onViewAnalytics,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the overflow menu when clicking outside it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasOverflowActions = onDuplicate || onArchive || onViewAnalytics;

  return (
    <div className="flex items-stretch gap-2.5">
      <button
        type="button"
        onClick={onEdit}
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white bg-linear-to-r from-primary-600 to-accent-600 hover:opacity-90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
      >
        <Pencil size={16} />
        Edit Product
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 active:scale-[0.98] transition-all duration-200 cursor-pointer"
      >
        <Trash2 size={16} />
        <span className="hidden sm:inline">Delete</span>
      </button>

      {/* {hasOverflowActions && (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="More actions"
            aria-expanded={menuOpen}
            className="h-full inline-flex items-center justify-center w-12 rounded-full text-content bg-circle-background border border-border-soft hover:bg-white/5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-48 rounded-xl bg-card border border-border-soft shadow-xl shadow-black/30 overflow-hidden z-10">
              {onDuplicate && (
                <button
                  type="button"
                  onClick={() => {
                    onDuplicate();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-content hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                >
                  <Copy size={15} className="text-text-secondary" />
                  Duplicate
                </button>
              )}
              {onArchive && (
                <button
                  type="button"
                  onClick={() => {
                    onArchive();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-content hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                >
                  <Archive size={15} className="text-text-secondary" />
                  Archive
                </button>
              )}
              {onViewAnalytics && (
                <button
                  type="button"
                  onClick={() => {
                    onViewAnalytics();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-content hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                >
                  <BarChart3 size={15} className="text-text-secondary" />
                  View Analytics
                </button>
              )}
            </div>
          )}
        </div>
      )} */}
    </div>
  );
}