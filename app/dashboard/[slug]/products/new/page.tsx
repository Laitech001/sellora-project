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
    <div className="lg:flex justify-between">
      <Instruction />

      <AddProductForm storeSlug={slug} />
    </div>
  )
}