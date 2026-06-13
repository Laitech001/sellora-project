'use client'
import { updateOrderStatus } from '@/lib/data/Orders';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'
import { Modal } from '@/ui';
import { Package, CheckCircle } from 'lucide-react';
import Image from 'next/image';

type OrderDetailsModalProps = {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
  orderItems: {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    product_price: number;
    subtotal: number;
    product_image: string;
  }[];
  orderStatus?: string;
  customerName?: string;
  customerNumber?: number;
  orderTotalPrice?: number;
  orderDate?: string;
}

export default function OrderDetailsModal({ orderId, isOpen, onClose, orderItems, orderStatus, customerName, customerNumber, orderTotalPrice, orderDate }: OrderDetailsModalProps) {
  const router = useRouter();
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(orderStatus);

  useEffect(() => {
    setCurrentStatus(orderStatus);
  }, [orderStatus]);

  const isFinalStatus =
    currentStatus === "delivered" ||
    currentStatus === "cancelled";


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const getOrdinal = (day: any) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);

    const day = date.toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      day: "numeric",
    });

    const monthYear = date.toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      month: "long",
      year: "numeric",
    });

    const time = date.toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${day}${getOrdinal(Number(day))} ${monthYear}, ${time}`;
  };

  // update status
  const handleStatusUpdate = async (
    status: "pending" | "processing" | "delivered" | "cancelled"
  ) => {
    if (!orderId) return;

    try {
      setUpdateStatus(status);

      await updateOrderStatus(orderId, status);

      setCurrentStatus(status);

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateStatus(null);
    }
  };

  return (
    <>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
        >
          <div className='flex items-center mb-4 gap-2'>
            <Package className='text-primary-500' size={30} />
            <span className='text-xl font-semibold'>Order Items</span>
          </div>
          

          <section className='flex justify-between gap-4'>
            <div className='border border-slate-500 rounded-lg p-3 mb-4'>
              <div className='flex flex-col'>
                <p className='text-sm text-slate-500'>Order ID</p>
                <h1 className='text-lg font-semibold'>#{orderId?.toString().padStart(4, '0')}</h1>
              </div>
              
              <div className='flex flex-col'>
                <p className='text-sm text-slate-500'>Date</p>
                <h1 className='text-md font-semibold'>{formatDate(orderDate)}</h1>
              </div>

              <div className='flex flex-col'>
                <p className='text-sm text-slate-500'>Status</p>
                <h1 className='text-lg font-semibold'>{orderStatus}</h1>
              </div>
            </div>

            <div className='border border-slate-500 rounded-lg p-3 mb-4'>
              <div className='flex flex-col'>
                <p className='text-sm text-slate-500'>Customer Name</p>
                <h1 className='text-lg font-semibold'>{customerName}</h1>
              </div>

              <div className='flex flex-col'>
                <p className='text-sm text-slate-500'>Customer Number</p>
                <h1 className='text-lg font-semibold'>{customerNumber}</h1>
              </div>
              
            </div>
          </section>

          <div>
            {
              orderItems.map((item) => (
                <div 
                  key={item.id}
                  className='flex flex-wrap justify-between gap-6 border border-slate-500 rounded-lg p-3 mb-2'
                >

                  <section className='flex align-baseline gap-2'>
                    <div>
                      <Image 
                        src={item.product_image}
                        alt={item.product_name}
                        width={60}
                        height={60}
                        priority
                        className='rounded object-fill'
                      />
                    </div>

                    <div className='space-y-1'>
                      <h1 className='text-md font-semibold'>{item.product_name}</h1>

                      <p className='text-sm text-slate-500'>Quantity: {item.quantity}</p>

                      <h1 className='text-emerald-500 text-md font-semibold'>{formatPrice(item.product_price)}</h1>
                    </div>
                  </section>
                  
                  <section className='flex flex-col items-end'>
                    <p className='text-slate-500 text-sm font-normal'>Item Total</p>
                    <h1 className='text-emerald-500 text-lg font-semibold'>{formatPrice(item.subtotal)}</h1>
                  </section>
                
                </div>
              ))
            }
          </div>

          <div className='space-y-1 border border-slate-500 rounded-lg p-3 mb-4'>
            <div className='border-b border-slate-500'>
              <section className='flex justify-between items-center'>
                <p className='text-sm text-slate-500'>Subtotal</p>
                <h1 className='text-md font-normal'>{formatPrice(orderTotalPrice!)}</h1>
              </section>

              <section className='flex justify-between items-center'>
                <p className='text-sm text-slate-500'>Delivery fee</p>
                <h1 className='text-md font-normal'>{formatPrice(0)}</h1>
              </section>

              <section className='flex justify-between items-center mb-4'>
                <p className='text-sm text-slate-500'>Discount</p>
                <h1 className='text-md font-normal'>{formatPrice(0)}</h1>
              </section>
            </div>

            <section className='flex justify-between items-center mt-2'>
              <p className='text-content text-md font-semibold'>Total Amount</p>
              <h1 className='text-emerald-500 text-lg font-semibold'>{formatPrice(orderTotalPrice!)}</h1>
            </section>
          </div>

          <div>
            <h3 className="text-sm text-slate-400 mb-1">
              Update Status
            </h3>

            <div className='flex flex-col gap-1 items-start'>
              <button
                disabled={isFinalStatus || updateStatus !== null}
                onClick={() => handleStatusUpdate('pending')}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-md bg-amber-500/20 text-amber-400 hover:bg-amber-500/10 transition-all
                  ${isFinalStatus ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {currentStatus === 'pending' && <CheckCircle size={16} className='text-emerald-500'/>}
                {updateStatus === 'pending' ? 'Updating...' : 'Mark as Pending'}
              </button>

              <button
                disabled={isFinalStatus || updateStatus !== null}
                onClick={() => handleStatusUpdate('processing')}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-md bg-sky-500/20 text-blue-400 hover:bg-sky-500/10 transition-all
                  ${isFinalStatus ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {currentStatus === 'processing' && <CheckCircle size={16} className='text-emerald-500'/>}
                {updateStatus === 'processing' ? 'Updating...' : 'Mark as Processing'}
              </button>

              <button
                disabled={isFinalStatus || updateStatus !== null}
                onClick={() => handleStatusUpdate('delivered')}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 transition-all
                  ${isFinalStatus ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {currentStatus === 'delivered' && <CheckCircle size={16} className='text-emerald-500'/>}
                {updateStatus === 'delivered' ? 'Updating...' : 'Mark as Delivered'}
              </button>

              <button
                disabled={isFinalStatus || updateStatus !== null}
                onClick={() => handleStatusUpdate('cancelled')}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/10 transition-all
                  ${isFinalStatus ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {currentStatus === 'cancelled' && <CheckCircle size={16} className='text-emerald-500'/>}
                {updateStatus === 'cancelled' ? 'Updating...' : 'Mark as Cancelled'}
              </button>

              {isFinalStatus && (
                <p className="text-sm text-slate-500 mb-2">
                  This order has been finalized and can no longer be updated.
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
    
  )
}