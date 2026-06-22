'use client';
import ProductCard from "./ProductCard"
import { addProductToCart } from "@/lib/cart"

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  storage_path: string;
  is_primary: boolean;
  created_at: string;
};

type ProductProps = {
  products: {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    store_id: string;

    product_images: ProductImage[];
  }[]
  slug: string;
}

export default function StoreClient({ products, slug }: ProductProps) {

  const handleAddToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      console.error('Product not found for cart:', productId);
      return;
    }

    addProductToCart(product, slug);

    alert('Product added to cart');
  };

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center items-center py-8 px-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            slug={slug}
            onAddToCart={handleAddToCart}
          />
        ))}
      </section>
    </>
  )
}