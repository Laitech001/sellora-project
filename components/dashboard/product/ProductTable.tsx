'use client'
import { Table, Modal, Button, Card } from "@/ui";
import ProductRow from "./ProductRow";
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
};

export default function ProductTable({ products, slug }: ProductProps & { slug: string }) {
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
      const res = await fetch(`/api/stores/${slug}/products/${selectedId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      setIsModalOpen(false);
      setSelectedId(null);
      router.refresh();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete product"
      );
    } finally {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  }

  return (
    <>
      <Table className="border border-slate-500 rounded-lg shadow-md">
        <thead>
          <tr className="text-left text-sm font-light text-gray-200 border-b border-slate-500 py-4">
            <th className="py-3">Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              products={product}
              editLink={`products/${product.id}/edit`}
              detailsLink={`products/${product.id}`}
              onDelete={handleOnDelete}
            />
          ))}
        </tbody>
      </Table>

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