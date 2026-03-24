import Link from 'next/link'
import EmptyState from '../components/products/EmptyState'
import ProductTable from '../components/products/ProductTable'

export default function Products() {
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

      <section className='flex flex-col justify-center items-center h-[calc(100vh-100px)]'>
        <EmptyState 
          title= 'No Product Added'
          description='Click on Add Product to add to first Product'
          actionText='Add Product'
          actionLink='dashboard/products/new'
        />
      </section>

      <ProductTable />
    
    </>
  )
}