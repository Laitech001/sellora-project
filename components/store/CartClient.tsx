'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";
import { Home } from 'lucide-react';
import { Card, Form, Modal, Label, TextInput, Button, FloatingButton } from "@/ui";
import { toast } from 'sonner';

type CartClientProps = {
  slug: string;
}

type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartClient({ slug }: CartClientProps) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
  });

  useEffect(() => {
    const getCartItems = () => {
      const cartData = localStorage.getItem(`cart-${slug}`);
      return cartData ? JSON.parse(cartData) : [];
    }
    setCartItems(getCartItems());
  }, [slug]);
  
  // increase quantity of cart item
  const increaseQuantity = (productId: string) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCartItems(updatedCart);

    localStorage.setItem(
      `cart-${slug}`,
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // decrease quantity of cart item
  const decreaseQuantity = (productId: string) => {
    const updatedCart = cartItems
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);

    localStorage.setItem(
      `cart-${slug}`,
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };


  // remove cart item
  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(
      (item) => item.productId !== productId
    );

    setCartItems(updatedCart);

    localStorage.setItem(
      `cart-${slug}`,
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };
  
  // calculate total items in cart
  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // calculate total price of items in cart
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Order now button click handler
  const handleOnOrder = () => {
    setIsModalOpen(true);
  }

  // handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //handle modal close
  const onClose = () => {
    setIsModalOpen(false);
  }

  //handle submit order form
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          storeSlug: slug,
          ...formData,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Order error response:", data);
        throw new Error(data.error || "Failed to place order");
      }

      localStorage.removeItem("cart");
      setCartItems([]);

      if (data.hasWhatsapp && data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.success("Your order has been placed! The seller will reach out to confirm details soon.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "There was an error submitting your order. Please try again."
      );
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="lg:flex justify-center  gap-6">
        
        <Card
          variant="light" 
          className='border border-gray-200 shadow rounded-sm p-4 m-2 lg:min-w-3xl'
        >
          {cartItems.length === 0 ? (
            <div className="flex flex-col justify-center items-center gap-2">
              <h1 className="text-2xl font-semibold mt-10">
                Your cart is empty.
              </h1>

              <Link
                href={`/store/${slug}`}
                className='text-primary-500 hover:underline flex items-center gap-1'
              >
                Go to Homepage to Browse product
              </Link>
            </div>   
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItems 
                  key={item.productId} 
                  item={item} 
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  removeItem={removeItem}
                />
              ))}
            </div>
          )}
        </Card>

        <div className="lg:w-80">
          <CartSummary
            totalItems={totalItems}
            totalPrice={totalPrice}
            onClick={handleOnOrder}
          />
        </div>
      </div>

      {
        isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            
             <Form onSubmit={handleSubmitOrder}>
              <h2 className="font-bold text-center text-xl mb-4">Your Contact Information</h2>
              <div>
                <Label htmlFor="name">Name</Label>
                <TextInput 
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter Your Name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="number">Phone Number</Label>
                <TextInput 
                  id="number"
                  type="tel"
                  name="number"
                  value={formData.number}
                  placeholder="Enter your phone number"
                  onChange={handleChange}
                  required
                />
              </div>

              <div 
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 mb-4"
              >
                <p className="text-sm text-blue-900">
                  <strong>What happens next:</strong><br />
                  The vendor will contact you within 24 hours to confirm your order, 
                  discuss payment options, and arrange delivery.
                </p>
              </div>

              <section className="flex justify-center items-center gap-6">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Placing Order...' : 'Order'}
                </Button>
                <Button onClick={onClose} variant="secondary">Cancel</Button>
              </section>
            </Form>
          </Modal>
        )
      }

      <FloatingButton
        onClick={() => {router.push(`/store/${slug}`)}}
      >
        <Home />
      </FloatingButton>
    </>
  )
}