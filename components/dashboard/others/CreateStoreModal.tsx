'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, Button, Form, TextInput, TextArea, Label, Dropdown } from '@/ui'
import { toast } from 'sonner';
import { BUSINESS_CATEGORY_OPTIONS } from '@/lib/constants/data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateStoreModal({ isOpen, onClose }: Props) {
const router = useRouter();
const [loading, setLoading] = useState(false);
const [storeData, setStoreData] = useState({
  storeName: '',
  slug: '',
  whatsappNumber: '',
  businessCategory: '',
  address: ''
});

  // handle store data for change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setStoreData((prev) => {
      if (name === 'storeName') {
        return {
          ...prev,
          storeName: value,
          slug: generateSlug(value)
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });
  };

  // auto generate store slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  };

  // handle form submition
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/stores/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Something went wrong while creating the store.');
        console.log(result.error);
        return;
      }

      toast.success('Store created successfully!');
      router.push(`/dashboard/${result.store.slug}`);
      router.refresh();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setStoreData({
        storeName: '',
        slug: '',
        whatsappNumber: '',
        businessCategory: '',
        address: ''
      })
    }
    
  }

  return (
    <>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <Form onSubmit={handleSubmit}>
            <h1 className='text-center'>Create Store</h1>

            <div>
              <Label htmlFor="storeName">Store Name <span className="text-xs text-text-secondary font-normal">(required)</span></Label>
              <TextInput 
                id="storeName"
                type="text"
                name="storeName"
                value={storeData.storeName}
                placeholder="Enter Your Store Name"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="whatsappNumber">Whatsapp Number <span className="text-xs text-text-secondary font-normal">(required)</span></Label>
              <TextInput 
                id="whatsappNumber"
                type="tel"
                name="whatsappNumber"
                value={storeData.whatsappNumber}
                placeholder="Enter Your Phone Number"
                onChange={handleChange}
                required
              />

              <p className="mb-2 text-sm text-gray-400">
                An active WhatsApp number is required. Customer orders and store-related updates will be sent to this number.
              </p>
            </div>

            <div>
              <Label htmlFor="businessCategory">
                Business Category <span className="text-xs text-text-secondary font-normal">(required)</span>
              </Label>
              <Dropdown
                id="businessCategory"
                value={storeData.businessCategory}
                onChange={
                  (value: string) => setStoreData((prev) => ({ ...prev, businessCategory: value }))
                }
                options={BUSINESS_CATEGORY_OPTIONS}
                placeholder="Select your business category"
              />
            </div>

            <div>
              <Label htmlFor="address">Address <span className="text-xs text-text-secondary font-normal">(optional)</span></Label>
              <TextArea 
                id="address"
                name="address"
                value={storeData.address}
                placeholder="Enter Your Address"
                onChange={handleChange}            
              />
            </div>

            <div>
              <Label htmlFor="storeslug">Store Slug <span className="text-xs text-text-secondary font-normal">(auto generated)</span></Label>
              <TextInput 
                id="storeslug"
                type="text"
                name="slug"
                value={storeData.slug}
                placeholder="Auto generate slug from store name"
                onChange={handleChange}
                required
              />

              <p className="text-sm text-gray-500 mb-4">
                Your store URL:
                /store/{storeData.slug || 'your-store'}
              </p>
            </div>

            <Button
              type='submit'
              disabled={loading}
              className='w-full rounded-full'
            >
              {loading ? 'Creating Store...' : 'Create Store'}
            </Button>
          </Form>
        </Modal>
      )}
    </>
  )


}


