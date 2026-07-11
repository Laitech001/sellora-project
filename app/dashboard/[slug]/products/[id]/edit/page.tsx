import { createClient } from "@/lib/supabaseServer";
import { EditProductForm } from "@/components/dashboard/product";
 
 type PageProps = {
  params: {
    id: string;
    slug: string;
  }
  }

  export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: PageProps) {
  const { id, slug } = await params;

  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Unauthorized access to edit product');
    return <div>Unauthorized</div>;
  }

  const { data: storeData, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .single();

  if (storeError || !storeData) {
    console.error('Failed to fetch store data for edit product:', storeError);
    return <div className="text-red-500 flex justify-center">Store not found</div>;
  }

  if (storeData.user_id !== user.id) {
    console.error('User does not own the store for edit product');
    return <div className="text-red-500 flex justify-center">Unauthorized</div>;
  }

  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('store_id', storeData.id)
    .single()

  if (!productData || productError) {
    console.error('Failed to fetch product data for edit product:', productError);
    return <div className="text-red-500 flex justify-center">Product not found</div>
  }

  return (
    <>
      <EditProductForm product={productData} />
    </>
  )
}