'use client';
import ProductCard from "./ProductCard"

type ProductProps = {
  products: {
    id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
    store_id: string;
  }[];
  slug: string;
}

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function StoreClient({products, slug}: ProductProps) {

  const handleAddToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      console.error('Product not found for cart:', productId);
      return;
    }

    const cartItem: CartItem = {
      productId,
      slug: product.store_id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
    };

    const existingCart = localStorage.getItem(
      `cart-${slug}`
    );

    const cartItems: CartItem[] = existingCart
      ? JSON.parse(existingCart)
      : [];

    const existingItem = cartItems.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push(cartItem);
    }

    localStorage.setItem(
      `cart-${slug}`,
      JSON.stringify(cartItems)
    );

    window.dispatchEvent(new Event("cartUpdated"));

    alert('Product added to cart');

    console.log('Cart items after adding:', cartItems);
  };

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center items-center py-8 px-4">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            product={product} 
            onAddToCart={handleAddToCart}
          />
        ))}
      </section>
    </>
  )
}