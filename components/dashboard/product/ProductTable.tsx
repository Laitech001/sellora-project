'use client'
import { Table, Modal, Button } from "@/ui";
import ProductRow from "./ProductRow";
import { useState, useEffect } from 'react'
import { deleteProduct } from "@/lib/data/Products";
import { LoadingSpinner, ErrorState } from '@/ui'

type ProductProps = {
  products: {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    image_url: string; 
  }[];
};

export default function ProductTable({ products }: ProductProps) {

  console.log('ProductTable products:', products);
  
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
    try {
      await deleteProduct(id);
      setIsModalOpen(false);
      setSelectedId(null);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Table className="bg-gray-50 border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="text-left text-sm font-semibold text-gray-600 border-b border-gray-300 py-4">
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
            <p>Are you sure you want to delete this product!</p>

            <section className="flex justify-center items-center gap-6">
              <Button 
                varient="danger"
                onClick={() => handleDelete(selectedId!)}
              >
                Delete
              </Button>

              <Button onClick={onClose} varient="secondary">Cancel</Button>
            </section>
          </Modal>
        )
      } 
    </>
    
  )
}