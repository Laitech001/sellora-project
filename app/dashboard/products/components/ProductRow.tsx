import Link from 'next/link'
import Image from 'next/image'

type ProductRowProps = {
  imagePath?: string
  title: string
  price: number
  status: string
  editLink: string
  editText: string
  deleteLink: string
  deleteText: string
}

export default function ProductRow({ imagePath, title, price, status, editLink, editText, deleteLink, deleteText }: ProductRowProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  return (
    <tr 
      className="text-left border-b border-gray-300 p-2 hover:bg-gray-100"
    >
      <td>
        { imagePath && (
          <Image 
            src={imagePath} 
            alt={title}
            width={60} 
            height={60}
            className='p-2 rounded-md'
          />
        )}
      </td>
      <td className="py-3">{title}</td>
      <td className='font-semibold text-gray-800'>{formatPrice(price)}</td>
      <td>
        <span 
          className={`text-sm px-3 py-1 rounded-full ${
            status === "active"
              ? "bg-green-100 text-green-600"
              : "bg-gray-200 text-gray-900"
          }`}
        >
          {status}
        </span>
      </td>
      <td>
        <div className='flex justify-start items-center gap-10'>
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
        </div>
      </td>
      
    </tr>
  )
}