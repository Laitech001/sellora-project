"use client"
import { useState, useRef } from "react"
import { Button, Label, TextInput, TextArea, Form } from '@/ui'
import { useRouter } from "next/navigation"
import { UploadCloud, X, ImagePlus } from "lucide-react"
import { toast } from 'sonner';

type Props = {
  storeSlug: string;
};

const MAX_IMAGES = 4;

// One entry per selected image — keeps the File (for upload later)
// paired with a local preview URL (for display now).
type ImageEntry = {
  file: File;
  previewUrl: string;
};

export default function AddProductForm({ storeSlug }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  })

  const [images, setImages] = useState<ImageEntry[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Shared logic for adding files, whether they came from drag-drop or the file picker
  const addFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/")
    );

    if (incoming.length === 0) return;

    setImages((prev) => {
      const remainingSlots = MAX_IMAGES - prev.length;
      if (remainingSlots <= 0) return prev;

      const accepted = incoming.slice(0, remainingSlots);
      const newEntries: ImageEntry[] = accepted.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      return [...prev, ...newEntries];
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
    // reset so selecting the same file again still fires onChange
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      // release the object URL we created, to avoid memory leaks
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const isFull = images.length >= MAX_IMAGES;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true);

    console.log('Form get the storeSlug:', storeSlug);

    const form = new FormData();

    form.append('storeSlug', storeSlug);
    form.append('name', formData.name);
    form.append('price', formData.price);
    form.append('description', formData.description);
    form.append('stock', formData.stock);

    images.forEach(({ file }) => {
      form.append('images', file);
    });

    try {
      const res = await fetch(`/api/stores/${storeSlug}/products`, {
        method: 'POST',
        body: form,
      })

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      toast.success('Product added successfully');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add product"
      );
    } finally {
      setLoading(false);
      router.back();
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Form onSubmit={handleSubmit}>

        <h1 className="title text-center">Product Informations</h1>

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

        <section className="lg:flex items-center justify-between gap-2">

          <div>
            <Label htmlFor="price">Product Price</Label>
            <TextInput
              id="price"
              type="number"
              name="price"
              placeholder="₦ 0.00"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="stock">Stocks</Label>
            <TextInput
              id="stock"
              type="text"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>
        </section>

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

        {/* ── Product images: drag-and-drop + browse, max 4 ── */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="image-dropzone">Product Images</Label>
            <span className="text-xs text-text-secondary">
              {images.length}/{MAX_IMAGES}
            </span>
          </div>

          {/* Hidden native input — triggered by clicking the dropzone */}
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
            className={`flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors duration-200 ${
              isFull
                ? "border-border-soft bg-circle-background/40 cursor-not-allowed"
                : isDragOver
                ? "border-primary-500 bg-[rgba(124,58,237,0.08)] cursor-pointer"
                : "border-border-soft bg-circle-background/40 hover:border-[rgba(124,58,237,0.4)] cursor-pointer"
            }`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center mb-3 ${
                isDragOver ? "bg-[rgba(124,58,237,0.18)]" : "bg-circle-background"
              }`}
            >
              <UploadCloud
                size={20}
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
                  Drag & drop images here
                </p>
                <p className="text-xs text-text-secondary">
                  or click to browse — PNG, JPG up to 5MB each
                </p>
              </>
            )}
          </div>

          {/* Thumbnail previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {images.map((img, index) => (
                <div
                  key={img.previewUrl}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-border-soft bg-circle-background"
                >
                  <img
                    src={img.previewUrl}
                    alt={`Product preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150 hover:bg-black/80 cursor-pointer"
                  >
                    <X size={13} />
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] font-medium text-white bg-black/60 rounded-md px-1.5 py-0.5">
                      Cover
                    </span>
                  )}
                </div>
              ))}

              {/* Empty "add more" tile fills remaining grid slots, if any */}
              {!isFull &&
                Array.from({ length: MAX_IMAGES - images.length }).map((_, i) => (
                  <button
                    key={`empty-${i}`}
                    type="button"
                    onClick={openFilePicker}
                    className="aspect-square rounded-lg border border-dashed border-border-soft flex items-center justify-center text-text-secondary hover:border-[rgba(124,58,237,0.4)] hover:text-primary-300 transition-colors duration-150 cursor-pointer"
                  >
                    <ImagePlus size={18} />
                  </button>
                ))}
            </div>
          )}
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