"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { ResolvedThemeTokens } from "./theme";

type ProductImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
};

type Props = {
  images: ProductImage[];
  productName: string;
  tokens: ResolvedThemeTokens;
};

export default function ProductImageGallery({ images, productName, tokens }: Props) {
  // Sort so the primary image is always first, regardless of insert order.
  const sortedImages = [...images].sort((a, b) =>
    a.is_primary === b.is_primary ? 0 : a.is_primary ? -1 : 1
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = sortedImages[activeIndex];

  if (sortedImages.length === 0) {
    return (
      <div
        className={`aspect-square sm:aspect-4/5 w-full rounded-2xl flex flex-col items-center justify-center gap-2 ${tokens.emptyStateBg} ${tokens.emptyStateBorder}`}
      >
        <ImageOff size={28} className={tokens.emptyStateIcon} />
        <p className={`text-sm ${tokens.emptyStateText}`}>No images yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Primary image — mobile-first: full width square, slightly taller
          aspect ratio kicks in from sm: up where there's more vertical room. */}
      <div
        className={`w-full aspect-square sm:aspect-4/5 rounded-2xl overflow-hidden ${tokens.imageFrameBg} ${tokens.imageFrameBorder}`}
      >
        <img
          src={activeImage.image_url}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail strip — horizontal scroll on mobile (no wrapping,
          so it never pushes content below the fold), becomes a normal
          row once there's enough width to fit all 4 without scrolling. */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:overflow-visible pb-1 -mx-1 px-1 sm:mx-0 sm:px-0">
          {sortedImages.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden border-2 transition-colors duration-150 cursor-pointer ${
                index === activeIndex
                  ? tokens.thumbBorderActive
                  : tokens.thumbBorderInactive
              }`}
            >
              <img
                src={img.image_url}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}