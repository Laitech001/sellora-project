"use client";

import { useRouter } from "next/navigation";
import ProductDetailsView, { type Product } from "@/components/product-details/ProductDetailsView";
import DashboardAction from "@/components/product-details/DashboardAction";

export default function DashboardProductPage({ product, slug }: { product: Product; slug: string }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/${slug}/products/${product.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/stores/${slug}/products/${product.id}`, { method: "DELETE" });

    if (!res.ok) {
      const errrorData = await res.json();
      throw new Error(errrorData.message || "Failed to delete product");
    }

    if (res.ok) {
      router.push(`/dashboard/${slug}/products`);
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
    router.push(`/dashboard/${slug}/products/${product.id}/analytics`);
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