'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash } from 'lucide-react'
import { Button } from '@/ui'
import DeleteButton from './DeleteButton'

type ProductRowProps = {
  products: {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    image_url: string; 
  }
  editLink: string
  onDelete: (id: string) => void
  detailsLink: string
}

export default function ProductRow({ products, editLink, onDelete, detailsLink }: ProductRowProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const status = products.stock > 0 ? 'active' : 'inactive';

  // Validate if the image URL is properly formatted
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <tr 
      key={products.id}
      className="text-left border-b border-gray-300 p-2 hover:bg-gray-100"
    >
      <td>
        { isValidImageUrl(products.image_url) && (
          <Image 
            src={products.image_url!} 
            alt={products.name}
            width={60} 
            height={60}
            priority
            className='p-2 rounded-md'
          />
        )}
      </td>
      <td className="py-3">{products.name}</td>
      <td className='font-semibold text-gray-800'>{formatPrice(products.price)}</td>
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

          <div className='relative group'>
            <Link 
              href={editLink}
              className="primary px-4 py-1 rounded inline-flex items-center justify-center"
            >
              <Pencil size={18} />
            </Link>

            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md border border-gray-700 opacity-0 group-hover:opacity-100 transition">
              Edit
            </span>
          </div>
          
          <Link 
            href={detailsLink}
            className='secondary px-2 py-1 rounded'
          >
            View Details
          </Link>

          <div className='relative group'>
            
            <DeleteButton onClick={() => onDelete(products.id)}/>

            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md border border-gray-700 opacity-0 group-hover:opacity-100 transition">
              Delete
            </span>
          </div>
          
        </div>
      </td>
      
    </tr>
  )
}