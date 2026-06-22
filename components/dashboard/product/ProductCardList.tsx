'use client'
import ProductCard from "./ProductCard"
import { deleteProduct} from "@/lib/data/Products"

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  storage_path: string;
  is_primary: boolean;
  created_at: string;
};

type productProps = {
  products: {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    store_id: string;

    product_images: ProductImage[];
  }[]
}

export default function ProductCardList({products}: productProps) {


  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {products && products.map((product) => (
        <ProductCard 

          key={product.id}
          product={product}
          editLink={`products/${product.id}/edit`}
          detailsLink={`products/${product.id}`}
          onDelete={handleDelete}
        />
      ))}
    </>
  )

}