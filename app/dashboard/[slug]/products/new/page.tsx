import { Instruction, AddProductForm } from "@/components/dashboard/product";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NewProduct({ params }: Props) {
  const { slug } = await params;
  console.log('New Product page slug:', slug);

  return (
    <>
      <Instruction />

      <AddProductForm storeSlug={slug} />
    </>
  )
}