import Image from 'next/image';
import Link from 'next/link';

type ProdcuctCardProps = {
  imagePath?: string
  title: string
  price: number
  status: string
  editLink: string
  editText: string
  deleteLink: string
  deleteText: string
}

export default function ProductCard({ imagePath, title, price, status, editLink, editText, deleteLink, deleteText}: ProdcuctCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  return (
    <div className='flex flex-col gap-2 bg-white p-4 mb-2 rounded-2xl shadow-sm border hover:shadow-md transition'>
      <section className='flex items-center gap-3'>
        { imagePath && <Image 
          src={imagePath}
          alt={title}
          width={150} 
          height={100}
          className="object-cover rounded-lg"
        />}

        <h2 className='text-xl text-gray-900 font-semibold'>{title}</h2>
      </section>

      <section>
        <p className='text-xl text-gray-900 font-semibold'>
          {formatPrice(price)}
        </p>

        <p className='text-xl text-gray-900'>
          <strong>Status:</strong> 
          <span className={`text-sm px-3 py-1 rounded-full ${
              status === "active"
                ? "bg-green-100 text-green-600"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            {status}
          </span>
        </p>
      </section>

      <section className='flex items-center gap-5'>
        <Link 
            href={editLink}
            className='bg-blue-800 text-white px-3 py-1 rounded-lg hover:bg-blue-600'
          >
            {editText}
          </Link>

          <Link
            href={deleteLink}
            className='bg-red-700 text-white px-3 py-1 rounded-lg hover:bg-red-500' 
          >
            {deleteText}
          </Link>
      </section>
    </div>
  )
}