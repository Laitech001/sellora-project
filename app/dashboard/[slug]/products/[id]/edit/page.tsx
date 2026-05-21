 import { supabase } from "@/lib/supabase";
import { EditProductForm } from "@/components/dashboard/product";
 
 type PageProps = {
  params: {
    id: string;
  }
 }
 export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    return <div>Product not found</div>
  }
  
  return (
    <>
      <EditProductForm product={product} />
    </>
  )
 }