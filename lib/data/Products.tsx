type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  storage_path: string;
  is_primary: boolean;
  created_at: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  store_id: string;

  product_images: ProductImage[];
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function getProducts(): Promise<Product[]> {

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const products = await res.json();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
  
  return fetchProducts();
}

export async function getProductsBySlug(slug: string): Promise<Product[]> {
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
  }
  
  try {
    const res = await fetch(`${baseUrl}/api/stores/${slug}/products`);

    console.log(`Fetching products for store slug: ${slug}`);
    console.log('Fetch response:', res);

    if (!res.ok) {
      let message = 'Failed to fetch products';

      try {
        const errorData = await res.json();
        message = errorData?.error || message;
      } catch {}

      console.error('Failed to fetch products:', res.status, message);
      throw new Error(message);
    }

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }  
}


export const deleteProduct = async (id: string) => {
  
  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    method: 'DELETE'
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
}
