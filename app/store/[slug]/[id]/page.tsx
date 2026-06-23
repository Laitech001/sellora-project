import { StorefrontProductPage } from "@/components/store";
import { getStoreBySlug } from "@/lib/data/store";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export default async function StorefrontProductDetails({ params }: Props) {
  const { id, slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  console.log(slug);

  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Product not found</div>;
  }

  const product = await res.json();

  return <StorefrontProductPage product={product} store={store} />;
}