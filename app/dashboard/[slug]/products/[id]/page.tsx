import { ProductDetailsCard } from "@/components/dashboard/product";

type Props = {
  params: {
    id: string;
  }
}

export default async function ProductDetails({ params }: Props) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Product not found</div>;
  }

  const product = await res.json();


  return (
    <>
      <ProductDetailsCard product={product}/>
    </>
  )
}