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
    <Card
      className="p-2 mb-2 rounded hover:shadow-md transition-shadow duration-300"
    >
      <section className='flex gap-3 mb-2'>
        { isValidImageUrl(product.image_url) && <Image 
          src={product.image_url}
          alt={product.name}
          width={60} 
          height={60}
          className="w-auto h-auto object-cover rounded-lg"
        />}

        <div className='space-y-1'>
  
          <h2 className='text-lg font-normal'>{product.name}</h2>

          <p className='text-xl font-semibold'>
            {formatPrice(product.price)}
          </p>

          <p className='text-md'>
            <strong>Status:</strong> 
            <span className={`text-sm px-3 py-1 rounded-md ${
                status === "active"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
              }`}
            >
              {status}
            </span>
          </p>
        </div>
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
          variant='danger'
          size='small' 
        >
          Delete
        </Button>
      </section>
    </Card>
  )
}