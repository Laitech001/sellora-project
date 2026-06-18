'use client'
import { useState, useEffect } from 'react';
import { Button, Label, TextInput, TextArea, Form } from '@/ui';
import { useRouter } from 'next/navigation';

type ProductProps = {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    image_url: string;
    image: null | File;
  }
}

export default function EditProductForm({ product }: ProductProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product?.id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${product.id}`);

        if (!res.ok) {
          console.log('Failed to fetch product');
          return;
        }
        const data = await res.json();
        if (data) {
          setFormData({
            name: data.name,
            price: data.price.toString(),
            description: data.description,
            stock: data.stock.toString(),
            image: data.image,
          })
        }
      } catch (error) {
        console.error(error);
      }
    }

    console.log(product.id);
    fetchProduct();
  }, [product?.id] )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    if (!product) return;

    const form = new FormData();

    form.append('name', formData.name);
    form.append('price', formData.price);
    form.append('description', formData.description);
    form.append('stock', formData.stock);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        body: form,
      });

      if (!res.ok) {
        throw new Error('Failed to update product');
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      router.back();
    }
  }

  
  const handleCancel = () => {
    alert("Update cancelled");
    router.back();
  }

  return (
    <div className='max-w-xl mx-auto'>
      <Form onSubmit={handleSubmit}>
        <h1 className='title'>Edit Product</h1>

        <div>
          <Label htmlFor='name'>Product Name</Label>
          <TextInput
            id='name'
            placeholder='Product Name'
            name='name'
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <section className="lg:flex items-center justify-between gap-2">

          <div>
            <Label htmlFor='price'>Product Price</Label>
            <TextInput
              id='price'
              placeholder='Product Price'
              name='price'
              type='number'
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor='stock'>Product Stock</Label>
            <TextInput
              id='stock'
              placeholder='Product Stock'
              name='stock'
              type='number'
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
            />
          </div>
        </section>

        <div>
          <Label htmlFor='description'>Product Description</Label>
          <TextArea
            id='description'
            placeholder='Product Description'
            name='description'
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor='image'>Product Image</Label>
          <TextInput
            id='image'
            name='image'
            type='file'
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files ? e.target.files[0] : prev.image }))}
          />
        </div>

        <div className='flex items-center gap-4'>
          <Button type='submit' disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </Button>

          <Button onClick={handleCancel} type='button' variant='secondary'>
            Cancel
          </Button>
        </div>
      </Form>
    </div>    
  )
}