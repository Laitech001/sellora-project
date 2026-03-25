import Link from 'next/link'
import EmptyState from './components/EmptyState'
import ProductTable from './components/ProductTable'
import { getProducts } from '@/lib/data/Products'
import ProductCard from './components/ProductCard'

export default async function Products() {
  const products = await getProducts()

  return (
    <>
      <section className='flex justify-between items-center p-4'>
        <h1 className='text-lg md:text-xl'>Products</h1>

        <Link
          href='/dashboard/products/new'
          className='py-2 px-3 bg-blue-600 text-white border border-blue-600 rounded-lg text-md hover:bg-white hover:text-blue-600 transition'
        >
          + Add Product
        </Link>
      </section>

      {products && products.length > 0 ? (
        <>
          <div className='hidden md:block p-2'>
            <ProductTable />
          </div>
          
          <div className='md:hidden p-2'>
            {products && products.map((product) => (
              <ProductCard 
                key={product.id}
                imagePath={product.image} 
                title={product.name}
                price= {product.price}
                status={product.status}
                editLink={"product/link"}
                editText={"Edit"}
                deleteLink={"product/delete"}
                deleteText={"Delete"}
              />
            ))}
          </div>
          
        </>
      ) : (
        <section className='flex flex-col justify-center items-center h-[calc(100vh-100px)]'>
        <EmptyState 
          title= 'No Product Added'
          description='Click on Add Product to add to first Product'
          actionText='Add Product'
          actionLink='dashboard/products/new'
        />
      </section>
      )
      }

    
    </>
  )
}