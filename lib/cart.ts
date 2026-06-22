export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

// Minimal shape this function needs from a product — works whether
// the caller has a full product row from a list (StoreClient) or a
// single product object already loaded on a details page.
type CartableProduct = {
  id: string;
  name: string;
  price: number;
  product_images?: { image_url: string; is_primary: boolean }[];
};

function getPrimaryImageUrl(images?: { image_url: string; is_primary: boolean }[]): string {
  if (!images || images.length === 0) return "";
  const primary = images.find((img) => img.is_primary);
  return primary ? primary.image_url : images[0].image_url;
}

// The actual cart-writing logic, extracted so it doesn't care whether
// the caller found the product by searching a list or already had it
// in hand from a details page. Takes the product directly — no
// productId lookup happens in here, that's the caller's job if needed.
export function addProductToCart(product: CartableProduct, slug: string) {
  const cartItem: CartItem = {
    productId: product.id,
    slug,
    name: product.name,
    price: product.price,
    image: getPrimaryImageUrl(product.product_images),
    quantity: 1,
  };

  const existingCart = localStorage.getItem(`cart-${slug}`);
  const cartItems: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

  const existingItem = cartItems.find((item) => item.productId === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push(cartItem);
  }

  localStorage.setItem(`cart-${slug}`, JSON.stringify(cartItems));
  window.dispatchEvent(new Event("cartUpdated"));

  return cartItems;
}