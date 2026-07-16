'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, Button, Form, TextInput, TextArea, Label, Dropdown } from '@/ui'
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { BUSINESS_CATEGORY_OPTIONS } from '@/lib/constants/data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_STORE_DATA = {
  storeName: '',
  slug: '',
  whatsappNumber: '',
  businessCategory: '',
  address: ''
};

export default function CreateStoreModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState(INITIAL_STORE_DATA);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

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

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  };

  const resetForm = () => {
    setStoreData(INITIAL_STORE_DATA);
    setLogoFile(null);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
  };

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
        return;
      }

      const newSlug = result.store.slug;

      if (logoFile) {
        const logoForm = new FormData();
        logoForm.append('logo', logoFile);

        const logoRes = await fetch(`/api/stores/${newSlug}/storeLogo`, {
          method: 'POST',
          body: logoForm,
        });

        if (!logoRes.ok) {
          const logoErr = await logoRes.json().catch(() => ({}));
          toast.error(logoErr.error || 'Store created, but logo upload failed. You can add it later in Settings.');
        }
      }

      toast.success('Store created successfully!');
      resetForm();
      router.push(`/dashboard/${newSlug}`);
      router.refresh();

    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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

            <div className="mb-4">
              <Label htmlFor="logo">
                Store Logo <span className="text-xs text-text-secondary font-normal">(optional)</span>
              </Label>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-soft bg-circle-background">
                  {logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoPreview} alt="Store logo preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-text-secondary">No logo</span>
                  )}
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border-soft px-3 py-1.5 text-sm hover:bg-white/5">
                  <Upload size={14} />
                  {logoPreview ? "Change Logo" : "Upload Logo"}
                  <input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>
              <p className="mt-1.5 text-xs text-text-secondary">PNG, JPG or WEBP (max 2MB)</p>
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