'use client';
import { Card, Button } from "@/ui";
import Image from "next/image";

type ProductCardProps = {
  product : {
    id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
  }
  onAddToCart?: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  return (
    <Card
      variant="light"
      className="max-w-xl p-2 border border-gray-200 shadow-md rounded-md"
    >
      <section>
        <Image 
          src={product.image_url}
          alt={product.name}
          width={300}
          height={300}
          className="rounded-lg object-cover w-full h-40 mb-2"
        />
      </section>

      <section>
        <h2 className="text-md font-bold">{product.name}</h2>
        <p className="text-gray-500 text-sm">{product.description}</p>
        <p className="text-emerald-400">{formatPrice(product.price)}</p>
      </section>

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