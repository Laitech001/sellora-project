import { Package, Calendar, Tag } from "lucide-react";
import type { ResolvedThemeTokens } from "./theme";

type Props = {
  name: string;
  price: number;
  description: string;
  stocks: number;
  createdAt?: string;
  category?: string;
  tokens: ResolvedThemeTokens;
};

function formatPrice(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ProductInfo({
  name,
  price,
  description,
  stocks,
  createdAt,
  category,
  tokens,
}: Props) {
  const isLowStock = stocks > 0 && stocks <= 5;
  const isOutOfStock = stocks <= 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Title + price */}
      <div>
        <h1 className={`text-xl sm:text-2xl font-semibold font-display leading-snug mb-1.5 ${tokens.title}`}>
          {name}
        </h1>
        <p className={`text-2xl sm:text-3xl font-bold font-display ${tokens.priceGradient}`}>
          {formatPrice(price)}
        </p>
      </div>

      {/* Stock badge */}
      <div>
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1">
            Out of stock
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
            Only {stocks} left
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            In stock
          </span>
        )}
      </div>

      {/* Description */}
      <div>
        <h2 className={`text-sm font-semibold font-display mb-1.5 ${tokens.title}`}>
          Description
        </h2>
        <p className={`text-sm leading-relaxed whitespace-pre-line ${tokens.description}`}>
          {description}
        </p>
      </div>

      {/* Metadata */}
      <div className={`flex flex-col gap-2 pt-3 border-t ${tokens.divider}`}>
        <div className={`flex items-center gap-2 text-xs ${tokens.metaText}`}>
          <Package size={14} className={`${tokens.metaIcon} shrink`} />
          {/* Bug fix: this previously rendered as just "units in
              inventory" with no number — the {stocks} interpolation
              was missing here. */}
          <span>{stocks} {stocks === 1 ? "unit" : "units"} in inventory</span>
        </div>
        {category && (
          <div className={`flex items-center gap-2 text-xs ${tokens.metaText}`}>
            <Tag size={14} className={`${tokens.metaIcon} shrink`} />
            <span>{category}</span>
          </div>
        )}
        {createdAt && (
          <div className={`flex items-center gap-2 text-xs ${tokens.metaText}`}>
            <Calendar size={14} className={`${tokens.metaIcon} shrink`} />
            <span>Listed on {formatDate(createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}