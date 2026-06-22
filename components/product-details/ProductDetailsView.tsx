import { Card } from "@/ui";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import { getThemeTokens, type ProductTheme } from "./theme";
import type { ReactNode } from "react";

type ProductImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  stocks: number;
  created_at?: string;
  category?: string;
  product_images?: ProductImage[];
};

type Props = {
  product: Product;
  // The ONLY variant-specific piece besides theme. Storefront and
  // Dashboard pages each render this shell and pass in their own
  // action buttons — the shell itself never checks "what kind of
  // page is this," it just has a slot.
  actions: ReactNode;
  // "light" for the customer-facing storefront, "dark" for the
  // admin dashboard. Defaults to "dark" so existing dashboard call
  // sites that don't pass this prop keep working unchanged.
  theme?: ProductTheme;
};

export default function ProductDetailsView({
  product,
  actions,
  theme = "dark",
}: Props) {
  const images = product.product_images ?? [];
  const tokens = getThemeTokens(theme);

  return (
    <Card
      className={`w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 ${tokens.cardBg} ${tokens.cardBorder}`}
    >
      {/* Mobile-first: single column, image stacked above info.
          lg: switches to a two-column grid — image left, info+actions
          right — once there's enough width for it to read well. */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 gap-5">
        <ProductImageGallery
          images={images}
          productName={product.name}
          tokens={tokens}
        />

        <div className="flex flex-col gap-5">
          <ProductInfo
            name={product.name}
            price={product.price}
            description={product.description}
            stocks={product.stocks}
            createdAt={product.created_at}
            category={product.category}
            tokens={tokens}
          />

          {/* Actions sit right under the info on desktop (lg:), but on
              mobile we don't want them to scroll away — see the sticky
              wrapper used in the page-level examples below for that. */}
          <div className="hidden lg:block pt-2">{actions}</div>
        </div>
      </div>

      {/* Mobile/tablet actions: rendered once, outside the grid, so they
          can be wrapped in a sticky bottom bar at the page level without
          fighting the grid's own stacking context. */}
      <div className="lg:hidden mt-6">{actions}</div>
    </Card>
  );
}