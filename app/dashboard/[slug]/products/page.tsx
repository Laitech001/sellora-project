import Link from 'next/link'
import EmptyState from '../../../../components/shared/EmptyState'
import { ProductTable, ProductCardList } from '@/components/dashboard/product';
import { getProductsBySlug } from '@/lib/data/Products';
import { Card } from '@/ui';

type ParamsPprops = {
  params: Promise<{
    slug: string;
  }>
}

export default async function Products( {params}: ParamsPprops ) {
  const { slug } = await params;
  const products = await getProductsBySlug(slug);

  console.log(products.length);
  console.log('Products page slug:', slug);
  console.log('Products page products:', products);

  return (
    <div className='bg-white p-2 border border-gray-200 rounded-md m-4 '>

      <Card className='flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg mb-2'>

        <h1 className="text-2xl font-bold text-gray-800">Products</h1>

        <Link
          href={`/dashboard/${slug}/products/new`}
          className='py-2 px-3 bg-blue-500 text-white border border-blue-500 rounded-lg text-md hover:bg-white hover:text-blue-600 transition'
        >
          + Add Product
        </Link>
      </Card>
      
      {products && products.length > 0 ? (
        <>
          <div className='hidden md:block p-2'>
            <ProductTable products={products} />
          </div>
          
          <div className='md:hidden p-2'>
            <ProductCardList products={products}/>
          </div>
          
        </>
      ) : (
        <section className='flex flex-col justify-center items-center h-[calc(100vh-100px)]'>
          <EmptyState 
            title= 'No Product Added'
            description='Click on Add Product to add your first Product'
            actionText='Add Product'
            actionLink='/dashboard/products/new'
          />
        </section>
      )}

    
    </div>
  )
}