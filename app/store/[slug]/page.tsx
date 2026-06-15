import Hero from "@/components/store/Hero";
import StoreClient from "@/components/store/StoreClient";
import { getProductsBySlug } from "@/lib/data/Products";
import { getStoreBySlug } from "@/lib/data/store";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const products = await getProductsBySlug(slug);
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  return (
    <>
      <Hero store={store}/>

      <StoreClient products={products} slug={slug} />

    </>
  )
}