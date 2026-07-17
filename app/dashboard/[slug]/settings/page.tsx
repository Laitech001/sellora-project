import { StoreInfo, StoreLink, DeleteStore } from "@/components/dashboard/settings";
import { getStoreBySlug } from "@/lib/data/store";
 
export default async function SettingsRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  
  if (!store) return <div>Store not found</div>;

  return (
    <div className='mt-4 space-y-4'>
      <StoreInfo store={store} />
      <StoreLink slug={slug} />
      <DeleteStore store={{
        storeName: store.name,
        storeSlug: store.slug,
      }} />
    </div>
  );
}