"use client";
import { useRouter } from 'next/navigation';
import ProductDetailsView, { type Product } from "@/components/product-details/ProductDetailsView";
import StorefrontActions from "@/components/product-details/StorefrontActions";
import { FloatingButton } from '@/ui';
import { Home } from 'lucide-react';
import { addProductToCart } from "@/lib/cart";

type Props = {
  product: Product;
  store: {
    id: string;
    name: string;
    slug: string;
    whatsapp_number: string;
  }
};

export default function StorefrontProductPage({ product, store }: Props) {
  const router = useRouter();
  const isOutOfStock = product.stocks <= 0;

  function formatWhatsappNumber(phone: string) {
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      return `234${cleaned.slice(1)}`;
    }

    return cleaned;
  }

  const handleAddToCart = () => {
    addProductToCart(product, store.slug);
    alert("Product added to cart");
  };

  const handleContactSeller = () => {
    const message = `
      Hello,

      I would like to inquire about this product.

      📦 Product: ${product.name}
      💰 Price: ₦${product.price}

      🔗 Product Link:
      ${window.location.href}
    `;

    const whatsappUrl = `https://wa.me/${formatWhatsappNumber(store.whatsapp_number)}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
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
        onClick={() => {router.push(`/store/${store.slug}`)}}
      >
        <Home />
      </FloatingButton>
    </div>
  );
}