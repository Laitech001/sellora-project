export type ProductTheme = "light" | "dark";

export type ResolvedThemeTokens = {
  cardBg: string;
  cardBorder: string;
  title: string;
  description: string;
  metaText: string;
  metaIcon: string;
  priceGradient: string;
  divider: string;
  imageFrameBg: string;
  imageFrameBorder: string;
  thumbBorderActive: string;
  thumbBorderInactive: string;
  emptyStateBg: string;
  emptyStateBorder: string;
  emptyStateIcon: string;
  emptyStateText: string;
};

const lightTokens: ResolvedThemeTokens = {
  cardBg: "bg-white",
  cardBorder: "border border-gray-200",
  title: "text-gray-900",
  description: "text-gray-600",
  metaText: "text-gray-500",
  metaIcon: "text-primary-500",
  priceGradient: "bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent",
  divider: "border-gray-200",
  imageFrameBg: "bg-gray-100",
  imageFrameBorder: "border border-gray-200",
  thumbBorderActive: "border-primary-500",
  thumbBorderInactive: "border-transparent hover:border-gray-300",
  emptyStateBg: "bg-gray-100",
  emptyStateBorder: "border border-gray-200",
  emptyStateIcon: "text-gray-400",
  emptyStateText: "text-gray-500",
};

const darkTokens: ResolvedThemeTokens = {
  cardBg: "bg-card",
  cardBorder: "border border-border-soft",
  title: "text-content",
  description: "text-text-secondary",
  metaText: "text-text-secondary",
  metaIcon: "text-primary-400",
  priceGradient: "bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent",
  divider: "border-border-soft",
  imageFrameBg: "bg-circle-background",
  imageFrameBorder: "border border-border-soft",
  thumbBorderActive: "border-primary-500",
  thumbBorderInactive: "border-transparent hover:border-border-soft",
  emptyStateBg: "bg-circle-background",
  emptyStateBorder: "border border-border-soft",
  emptyStateIcon: "text-text-secondary",
  emptyStateText: "text-text-secondary",
};

export function getThemeTokens(theme: ProductTheme): ResolvedThemeTokens {
  return theme === "light" ? lightTokens : darkTokens;
}