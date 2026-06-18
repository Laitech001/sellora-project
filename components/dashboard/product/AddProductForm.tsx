"use client"
import { useState } from "react"
import { Button, Label, TextInput, TextArea, Form } from '@/ui'
import { useRouter } from "next/navigation"

type Props = {
  storeSlug: string;
};

export default function AddProductForm({storeSlug}: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    images: [] as File[],
  })

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;
    const files = target.files;

    if (name === "images" && files) {
      setFormData(prev => ({
        ...prev,
        images: Array.from(files),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.name.trim()) {
      alert('Product name is required');
      setLoading(false);
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      alert('Price must be a positive number');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      alert('Description is required');
      setLoading(false);
      return;
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      alert('Stock must be a non-negative number');
      setLoading(false);
      return;
    }

    console.log('Form get the storeSlug:', storeSlug);

    const form = new FormData();

    form.append('storeSlug', storeSlug);
    form.append('name', formData.name);
    form.append('price', formData.price);
    form.append('description', formData.description);
    form.append('stock', formData.stock);

    formData.images.forEach((image) => {
      form.append('images', image);
    });

    try {
      const res = await fetch(`/api/stores/${storeSlug}/products`, {
        method: 'POST',
        body: form,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add product');
      }

      alert('Product added successfully!');
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Failed to add product';
      alert(message);
    } finally {
      setLoading(false);
      router.back();
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Form onSubmit={handleSubmit}>

        <h1 className="title text-center">Add Product</h1>

        <div>
          <Label htmlFor="name">Product Name</Label>
          <TextInput
            id="name"
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="price">Product Price</Label>
          <TextInput
            id="price"
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="description">
            Product Description
          </Label>
          <TextArea
            id="description"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="stock">Stocks</Label>
          <TextInput 
            id="stock"
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="image">Product Image</Label>
          <TextInput 
            id="image"
            type="file"
            name="images"
            accept="image/*"
            onChange={handleChange}
            multiple
          />
        </div>
        
        <Button
          type="submit" 
          disabled={loading} 
          className="mt-4 w-full rounded-full"
          variant="gradient"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </Button>

      </Form>
    </div>
  )
} 