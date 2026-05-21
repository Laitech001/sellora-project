import Hero from "@/components/store/Hero";
import StoreClient from "@/components/store/StoreClient";
import { getProductsBySlug } from "@/lib/data/Products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const products = await getProductsBySlug(slug);

  return (
    <>
      <Hero />

      <StoreClient products={products} slug={slug} />

    </>
  )
}