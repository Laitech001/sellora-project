import EmptyState from '@/components/shared/EmptyState'
import { ProductTable, ProductCardList } from '@/components/dashboard/product';
import { getProductsBySlug } from '@/lib/data/Products';
import { Card, LoadingLink } from '@/ui';
import { PackageOpen } from 'lucide-react';

type ParamsPprops = {
  params: Promise<{
    slug: string;
  }>
}

export default async function Products( {params}: ParamsPprops ) {
  const { slug } = await params;
  const products = await getProductsBySlug(slug);

  return (
    <>
      <div className='bg-card p-2 border border-slate-500 rounded-md'>

        <Card className='flex justify-between items-center p-4 bg-card border border-slate-500 rounded-lg mb-2'>

          <h1 className="text-2xl font-bold text-gray-200">Products</h1>

          <LoadingLink
            href={`/dashboard/${slug}/products/new`}
            className='py-2 px-3 bg-linear-to-r from-primary-500 to-accent-500 text-white rounded-lg text-md transition'
            loadingText='Navigating...'
          >
            + Add Product
          </LoadingLink>
        </Card>
        
        {products && products.length > 0 ? (
          <>
            <div className='hidden md:block p-2'>
              <ProductTable products={products} slug={slug} />
            </div>
            
            <div className='md:hidden p-2'>
              <ProductCardList products={products} slug={slug} />
            </div>
            
          </>
        ) : (
          <section className="flex flex-col justify-center items-center h-[calc(100vh-100px)]">
            <EmptyState
              icon={<PackageOpen size={50} className="text-primary-500" />}
              title="No Product Added"
              description="Click on Add Product to add your first Product"
              actionText="Add Product"
              actionLink={`/dashboard/${slug}/products/new`}
            />
          </section>
        )}

      
      </div>
    </>
    
  )
}