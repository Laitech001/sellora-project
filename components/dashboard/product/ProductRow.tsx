'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Eye } from 'lucide-react'
import DeleteButton from '../../actions/DeleteButton'

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
      className="align-middle text-left border-b border-slate-500 py-3 px-4 hover:bg-slate-800/30 transition-all duration-200"
    >
      <td>
        { isValidImageUrl(products.image_url) && (
          <Image 
            src={products.image_url!} 
            alt={products.name}
            width={60} 
            height={60}
            priority
            className='rounded-md p-2 object-cover'
          />
        )}
      </td>
      <td className="py-3">{products.name}</td>
      <td className='font-semibold text-gray-200'>{formatPrice(products.price)}</td>
      <td>
        <span 
          className={`text-sm px-3 py-1 rounded-md ${
            status === "active"
              ? "bg-emerald-600 text-content"
              : "bg-slate-800 text-content"
          }`}
        >
          {status}
        </span>
      </td>
      <td>
        <div className='flex justify-start items-center gap-5'>

          <div className='relative group'>
            <Link 
              href={detailsLink}
              className='bg-dark border border-slate-500 px-2 py-1 rounded inline-flex items-center justify-center'
            >
              <Eye size={18} />
            </Link>

            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md border border-gray-700 opacity-0 group-hover:opacity-100 transition">
              view details
            </span>
          </div>

          <div className='relative group'>
            <Link 
              href={editLink}
              className="gradient px-2 py-1 rounded inline-flex items-center justify-center"
            >
              <Pencil size={18} />
            </Link>

            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md border border-gray-700 opacity-0 group-hover:opacity-100 transition">
              Edit
            </span>
          </div>

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