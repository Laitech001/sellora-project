import CartClient from "@/components/store/CartClient";

type ParamsProps = {
  params: Promise<{
    slug: string;
  }>
}

export default async function CartPage({ params }: ParamsProps) {
  const { slug } = await params;

  return (
    <>
      <CartClient slug={slug} />
    </>
  )
}