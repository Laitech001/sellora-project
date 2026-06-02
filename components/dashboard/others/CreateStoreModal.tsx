'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, Button, Form, TextInput, TextArea, Label } from '@/ui'

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateStoreModal({ isOpen, onClose }: Props) {
const router = useRouter();
const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);
const [storeData, setStoreData] = useState({
  storeName: '',
  slug: '',
  phoneNumber: '',
  businessType: '',
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
        setError(result.error);
        return;
      }

      router.push(`/dashboard/${result.store.slug}`);
      router.refresh();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setStoreData({
        storeName: '',
        slug: '',
        phoneNumber: '',
        businessType: '',
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
              <Label htmlFor="storeName">Store Name</Label>
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
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <TextInput 
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={storeData.phoneNumber}
                placeholder="Enter Your Phone Number"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <TextInput 
                id="businessType"
                type="text"
                name="businessType"
                value={storeData.businessType}
                placeholder="Enter Your Business Type"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <TextArea 
                id="address"
                name="address"
                value={storeData.address}
                placeholder="Enter Your Address"
                onChange={handleChange}            
              />
            </div>

            <div>
              <Label htmlFor="storeslug">Store Slug</Label>
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
            >
              {loading ? 'Creating Store...' : 'Create Store'}
            </Button>
          </Form>
        </Modal>
      )}
    </>
  )


}


