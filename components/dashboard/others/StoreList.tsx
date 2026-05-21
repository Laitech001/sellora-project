'use client';
import { useState } from 'react'
import { Modal, Button, Form, TextInput, TextArea, Label } from '@/ui'
import EmptyState from '@/components/shared/EmptyState';

export default function StoreList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState({
    storeName: '',
    slug: '',
    phoneNumber: '',
    businessType: '',
    address: ''
  });

  // open modal function
  const handleModalOpen = () => {
    setIsModalOpen(true);
  }

  // close modal function
  const handleModalClose = () => {
    setIsModalOpen(false);
  }

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
      console.log(storeData);
    } catch {
      console.log('Failed to Create Store');
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
      <section className='flex flex-col justify-center items-center h-[calc(100vh-100px)]'>
        <EmptyState 
          title= 'You have not created any store'
          description='Click on Create Store to create your first store'
        />
        <Button onClick={handleModalOpen}>
          Create Store
        </Button>
      </section>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
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