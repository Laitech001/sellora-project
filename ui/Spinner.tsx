type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullScreen?: boolean;
  className?: string;
};

const SIZE_MAP = {
  sm: "h-5 w-5 border-2",
  md: "h-9 w-9 border-[3px]",
  lg: "h-14 w-14 border-4",
};

export default function Spinner({ size = "md", label, fullScreen = false, className = "" }: SpinnerProps) {
  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        role="status"
        aria-label={label ?? "Loading"}
        className={`${SIZE_MAP[size]} animate-spin rounded-full border-border-soft`}
        style={{ borderTopColor: "var(--color-primary-500)" }}
      />
      {label && <p className="text-sm text-text-secondary">{label}</p>}
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/70 backdrop-blur-sm">
      {spinner}
    </div>
  );
}