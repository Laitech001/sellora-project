"use client";

import { useRouter } from "next/navigation";
import ProductDetailsView, { type Product } from "@/components/product-details/ProductDetailsView";
import DashboardAction from "@/components/product-details/DashboardAction";

// Same shell, same ProductInfo, same ProductImageGallery as the storefront
// page — the only difference is which actions component gets passed in,
// and what each button actually does.
export default function DashboardProductPage({ product, slug }: { product: Product; slug: string }) {
  const router = useRouter();

  console.log(slug);

  const handleEdit = () => {
    router.push(`/dashboard/${slug}/products/${product.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/products");
    } else {
      alert("Failed to delete product");
    }
  };

  const handleDuplicate = () => {
    console.log("Duplicate", product.id);
  };

  const handleArchive = () => {
    console.log("Archive", product.id);
  };

  const handleViewAnalytics = () => {
    router.push(`/dashboard/products/${product.id}/analytics`);
  };

  return (
    <div className="min-h-screen bg-dark px-4 py-8 sm:py-12">
      <ProductDetailsView
        product={product}
        actions={
          <DashboardAction
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onArchive={handleArchive}
            onViewAnalytics={handleViewAnalytics}
          />
        }
      />
    </div>
  );
}