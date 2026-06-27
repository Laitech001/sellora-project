'use client'
import ProductCard from "./ProductCard"
import { deleteProduct} from "@/lib/data/Products"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Modal, Button, Card } from '@/ui';

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
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleOnDelete = (id: string) => {
    setSelectedId(id)
    setIsModalOpen(true);
  }

  const onClose = () => {
    setIsModalOpen(false);
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteProduct(id);
      
      setSelectedId(null);
      setIsModalOpen(false);

      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
          onDelete={handleOnDelete}
        />
      ))}

      {
        isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <Card className="flex flex-col justify-center items-center p-6 gap-4 w-full max-w-md">
              <p className='text-content'>Are you sure you want to delete this product!</p>

              <section className="flex justify-center items-center gap-6">
                <Button 
                  variant="danger"
                  onClick={() => handleDelete(selectedId!)}
                >
                  {isLoading ? 'Deleting' : 'Delete'}
                </Button>

                <Button onClick={onClose} variant="secondary">Cancel</Button>
              </section>
            </Card>
          </Modal>
        )
      } 
    </>
  )

}