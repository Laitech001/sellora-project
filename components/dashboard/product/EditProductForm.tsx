'use client'
import { useState, useEffect, useRef } from 'react';
import { Button, Label, TextInput, TextArea, Form } from '@/ui';
import { useRouter } from 'next/navigation';
import { UploadCloud, X, ImagePlus, Star } from 'lucide-react';

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  storage_path: string;
  is_primary: boolean;
  created_at: string;
};

type ProductProps = {
  product: {
    id: string;
  };
};

const MAX_IMAGES = 4;

export default function EditProductForm({ product }: ProductProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  });

  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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
          });
          setExistingImages(data.product_images ?? []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [product?.id]);

  useEffect(() => {
    const urls = newImages.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  const visibleExistingImages = existingImages.filter(
    (img) => !removedImageIds.includes(img.id)
  );
  const totalImageCount = visibleExistingImages.length + newImages.length;
  const isFull = totalImageCount >= MAX_IMAGES;

  const removeExistingImage = (imageId: string) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addFiles = (incoming: FileList | File[]) => {
    const files = Array.from(incoming).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) return;

    setNewImages((prev) => {
      const remainingSlots = MAX_IMAGES - (visibleExistingImages.length + prev.length);
      if (remainingSlots <= 0) return prev;
      return [...prev, ...files.slice(0, remainingSlots)];
    });
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!product) {
      setLoading(false);
      return;
    }

    const form = new FormData();

    form.append('name', formData.name);
    form.append('price', formData.price);
    form.append('description', formData.description);
    form.append('stock', formData.stock);

    // New image files — same key the PATCH route expects via getAll('images')
    newImages.forEach((file) => {
      form.append('images', file);
    });

    // Ids of existing images to delete — PATCH route reads these via
    // getAll('removeImageIds')
    removedImageIds.forEach((id) => {
      form.append('removeImageIds', id);
    });

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        body: form,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update product');
      }

      alert('Product updated successfully!');
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Failed to update product';
      alert(message);
    } finally {
      setLoading(false);
      router.back();
    }
  };

  const handleCancel = () => {
    alert("Update cancelled");
    router.back();
  };

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center text-text-secondary text-sm">
        Loading product...
      </div>
    );
  }

  return (
    <div className='w-full max-w-2xl mx-auto px-4 sm:px-6'>
      <Form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <h1 className='title text-content text-center text-xl sm:text-2xl font-semibold font-display'>
          Edit Product
        </h1>

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

        <section className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-3">
          <div className="flex-1">
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

          <div className="flex-1">
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

        {/* ── Product images ── */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="image-dropzone">Product Images</Label>
            <span className="text-xs text-text-secondary">
              {totalImageCount}/{MAX_IMAGES}
            </span>
          </div>

          <input
            ref={fileInputRef}
            id="image-dropzone"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div
            onClick={!isFull ? openFilePicker : undefined}
            onDrop={!isFull ? handleDrop : undefined}
            onDragOver={!isFull ? handleDragOver : undefined}
            onDragLeave={!isFull ? handleDragLeave : undefined}
            className={`flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed px-3 py-6 sm:px-4 sm:py-8 transition-colors duration-200 ${
              isFull
                ? "border-border-soft bg-circle-background/40 cursor-not-allowed"
                : isDragOver
                ? "border-primary-500 bg-[rgba(124,58,237,0.08)] cursor-pointer"
                : "border-border-soft bg-circle-background/40 hover:border-[rgba(124,58,237,0.4)] cursor-pointer"
            }`}
          >
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center mb-2.5 sm:mb-3 ${
                isDragOver ? "bg-[rgba(124,58,237,0.18)]" : "bg-circle-background"
              }`}
            >
              <UploadCloud
                size={18}
                className={isDragOver ? "text-primary-300" : "text-text-secondary"}
              />
            </div>

            {isFull ? (
              <p className="text-sm text-text-secondary">
                Maximum of {MAX_IMAGES} images reached
              </p>
            ) : (
              <>
                <p className="text-sm text-content font-medium mb-0.5">
                  Tap to add images
                  <span className="hidden sm:inline"> or drag & drop</span>
                </p>
                <p className="text-xs text-text-secondary">PNG, JPG up to 5MB each</p>
              </>
            )}
          </div>

          {/* Existing images (from DB) + new images (just picked),
              shown together in one grid. Each tile knows how to remove
              itself regardless of which array it came from. */}
          {(visibleExistingImages.length > 0 || newImages.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-3">
              {visibleExistingImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-border-soft bg-circle-background"
                >
                  <img
                    src={img.image_url}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    aria-label="Remove image"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150 hover:bg-black/80 active:scale-90 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                  {img.is_primary && (
                    <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-white bg-black/60 rounded-md px-1.5 py-0.5">
                      <Star size={9} fill="currentColor" />
                      Cover
                    </span>
                  )}
                </div>
              ))}

              {newImagePreviews.map((url, index) => (
                <div
                  key={url}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-primary-500/40 bg-circle-background"
                >
                  <img
                    src={url}
                    alt={`New image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    aria-label="Remove image"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150 hover:bg-black/80 active:scale-90 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                  <span className="absolute bottom-1.5 left-1.5 text-[10px] font-medium text-white bg-primary-600/80 rounded-md px-1.5 py-0.5">
                    New
                  </span>
                </div>
              ))}

              {!isFull &&
                Array.from({ length: MAX_IMAGES - totalImageCount }).map((_, i) => (
                  <button
                    key={`empty-${i}`}
                    type="button"
                    onClick={openFilePicker}
                    className="aspect-square rounded-lg border border-dashed border-border-soft flex items-center justify-center text-text-secondary hover:border-[rgba(124,58,237,0.4)] hover:text-primary-300 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <ImagePlus size={16} />
                  </button>
                ))}
            </div>
          )}
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