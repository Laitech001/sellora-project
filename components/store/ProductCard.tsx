'use client';
import { Card, Button } from "@/ui";
import Image from "next/image";
import Link from 'next/link';

type ProductImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
};

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    created_at?: string;
    category?: string;
    product_images?: ProductImage[];
  }
  slug: string;
  onAddToCart: (productId: string) => void;
};

export default function ProductCard({ product, slug, onAddToCart }: ProductCardProps) {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const primaryImage =
    product.product_images?.find((img) => img.is_primary) ||
    product.product_images?.[0];

  const imageUrl = primaryImage?.image_url;
  return (
    <Card
      variant="light"
      className="max-w-xl p-2 border border-gray-200 shadow-md rounded-md cursor-pointer 
      transition-all duration-300 ease-out
      hover:-translate-y-1 hover:shadow-lg"
    >
      <Link href={`/store/${slug}/${product.id}`}>
        <section>
          {
            imageUrl && isValidImageUrl(imageUrl) && (
              <Image 
                src={imageUrl}
                alt={product.name}
                width={300}
                height={300}
                className="rounded-lg object-cover w-full h-40 mb-2"
              />
            )
          }
        </section>

        <section>
          <h2 className="text-md font-bold">{product.name}</h2>
          <p className="text-gray-500 text-sm">{product.description}</p>
          <p className="text-emerald-400">{formatPrice(product.price)}</p>
        </section>
      </Link>

      <section className="flex flex-col md:flex-row justify-between items-center gap-3">
        {onAddToCart && (
          <Button onClick={() => onAddToCart(product.id)} className="m-auto w-full rounded" size="small">
            Add to Cart
          </Button>
        )}
      </section>
    </Card>
    
  )
}  