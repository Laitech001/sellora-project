'use client'
import { Card, Button } from "@/ui"
import Image from 'next/image'
import { useRouter } from "next/navigation"

type ProductProps = {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    image_url: string;
  }
}

export default function ProductDetailsCard({product}: ProductProps) {

  const router = useRouter();
  const status = product.stock > 0 ? 'active' : 'inactive';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch (`/api/products/${product.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Failed to delete product');  
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      return;
    } finally {
      router.back();
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center p-4">
      <Card>
        <Image 
          src={product.image_url}
          alt={product.name}
          width={300}
          height={300}
          priority
          className="w-full object-cover rounded-xl shadow-sm"
        />
      </Card>

      <Card className="space-y-3">
        <h1 className="text-xl font-semibold text-green-600">
          {product.name}
        </h1>
        <p className="text-xl font-semibold">
          {formatPrice(product.price)}
        </p>
        <p className="font-semibold text-xl">
          <span className="font-semibold">Stock: </span>
          {product.stock}
        </p>
        <p className="text-xl">
          <span className="font-semibold">Status: </span>
          <span 
            className={`text-sm px-3 py-1 rounded-full ${
              status === "active"
                ? "bg-green-100 text-green-600"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            {status}
          </span>
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Description: </span>
          {product.description}
        </p>

        <div className="flex gap-3">
          <Button 
            className="primary"
            onClick={() => {
              router.push(`/dashboard/products/${product.id}/edit`)
            }}
          >
              Edit
          </Button>
          <Button 
            className="danger"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  )
}