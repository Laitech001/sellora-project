import Image from 'next/image';
import Link from 'next/link';
import { Card, Button } from '@/ui';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    image_url: string;
  }
  editLink: string;
  detailsLink: string;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, editLink, detailsLink, onDelete }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const status = product.stock > 0 ? 'active' : 'inactive';

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
    <Card className="mb-2 hover:shadow-md transition-shadow duration-300">
      <section className='flex items-center gap-3'>
        { isValidImageUrl(product.image_url) && <Image 
          src={product.image_url}
          alt={product.name}
          width={100} 
          height={100}
          className="w-auto h-auto object-cover rounded-lg"
        />}

        <h2 className='text-xl text-gray-900 font-semibold'>{product.name}</h2>
      </section>

      <section className='mb-2'>
        <p className='text-xl text-gray-900 font-semibold'>
          {formatPrice(product.price)}
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
          className='primary px-2 py-1 rounded'
        >
          Edit
        </Link>
      
        <Link href={detailsLink} className="secondary px-2 py-1 rounded">
          View details
        </Link>

        <Button
          onClick={() => onDelete(product.id)}
          varient='danger'
          size='small' 
        >
          Delete
        </Button>
      </section>
    </Card>
  )
}