"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type LoadingLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  loadingText?: React.ReactNode;
  spinnerSize?: number;
  spinnerPosition?: "left" | "right";
  disabled?: boolean;
  onClick?: () => void;
};

export default function LoadingLink({
  href,
  children,
  className = "",
  loadingText,
  spinnerSize = 16,
  spinnerPosition = "right",
  disabled = false,
  onClick,
}: LoadingLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (isPending || disabled) return;
    onClick?.();
    startTransition(() => {
      router.push(href);
    });
  };

  const spinner = <Loader2 size={spinnerSize} className="animate-spin" />;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending || disabled}
      aria-busy={isPending}
      className={`inline-flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {isPending && spinnerPosition === "left" && spinner}
      {isPending ? <span>{loadingText ?? children}</span> : children}
      {isPending && spinnerPosition === "right" && spinner}
    </button>
  );
}