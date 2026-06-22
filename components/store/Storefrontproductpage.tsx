"use client";

import ProductDetailsView, { type Product } from "@/components/product-details/ProductDetailsView";
import StorefrontActions from "@/components/product-details/StorefrontActions";
import { FloatingButton } from '@/ui';
import { Home } from 'lucide-react';
import { addProductToCart } from "@/lib/cart";

type Props = {
  product: Product;
  slug: string;
};

export default function StorefrontProductPage({ product, slug }: Props) {
  const isOutOfStock = product.stocks <= 0;

  const handleAddToCart = () => {
    addProductToCart(product, slug);
    alert("Product added to cart");
  };

  const handleContactSeller = () => {
    console.log("Contact seller about", product.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
      <ProductDetailsView
        product={product}
        theme="light"
        actions={
          <StorefrontActions
            disabled={isOutOfStock}
            onAddToCart={handleAddToCart}
            onContactSeller={handleContactSeller}
          />
        }
      />

      <FloatingButton
        onClick={() => {`/store/${slug}`}}
      >
        <Home />
      </FloatingButton>
    </div>
  );
}