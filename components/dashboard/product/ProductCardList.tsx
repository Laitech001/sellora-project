'use client'
import ProductCard from "./ProductCard"
import { deleteProduct} from "@/lib/data/Products"

type Product = {
  products: {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    image_url: string;
  }[]
}

export default function ProductCardList({products}: Product) {


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