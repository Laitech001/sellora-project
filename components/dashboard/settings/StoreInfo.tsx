'use client'

import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Upload, Store, Loader2, Check } from 'lucide-react';
import { Store as storeTyped } from '@/types';
import { Field } from '@/ui';

type StoreInfoProps = {
  store: storeTyped;
  onLogoChange?: (file: File) => Promise<void> | void; 
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function StoreInfo({ store, onLogoChange }: StoreInfoProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: store.name,
    whatsapp_number: store.whatsapp_number,
    email: store.email ?? "",
  });
  const [logoPreview, setLogoPreview] = useState(store.logo_url ?? "");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFieldChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }

    const previousPreview = logoPreview;
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl); // optimistic preview while uploading

    setIsUploadingLogo(true);
    try {
      const form = new FormData();
      form.append("logo", file);

      const res = await fetch(`/api/stores/${store.slug}/storeLogo`, {
        method: "PATCH",
        body: form,
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || "Failed to upload logo");
      }

      const data = await res.json();
      setLogoPreview(data.logoUrl);
      toast.success("Logo updated");
      await onLogoChange?.(file);
      router.refresh(); // refresh the page to reflect the new logo
    } catch (error) {
      setLogoPreview(previousPreview); // roll back the optimistic preview
      toast.error(error instanceof Error ? error.message : "Failed to upload logo");
    } finally {
      URL.revokeObjectURL(objectUrl);
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/stores/${store.slug}/store`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || "Failed to save changes");
      }

      toast.success("Store settings saved");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save changes"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (  
    <>
      <section className='w-full rounded-xl border border-border-soft bg-card p-4 md:p-6'>
        <div className="mb-6 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600/20 text-primary-400">
            <Store size={18} />
          </span>
          <div>
            <h2 className="font-semibold">Store Information</h2>
            <p className="text-sm text-text-secondary">Update your store's basic information.</p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <Field label="Store Name">
            <input
              value={form.name}
              onChange={handleFieldChange("name")}
              className="input"
            />
          </Field>
          <Field label="WhatsApp Number" hint="Used to receive orders from customers.">
            <input
              value={form.whatsapp_number}
              onChange={handleFieldChange("whatsapp_number")}
              className="input"
            />
          </Field>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium">Store Logo</label>
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-soft bg-circle-background">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Store logo"
                  className="h-full w-full object-cover"
                  onError={() => setLogoPreview("")}
                />
              ) : (
                <span className="text-lg font-semibold text-content">{getInitials(form.name)}</span>
              )}
            </div>
            <div>
              <p className="text-xs text-text-secondary">Recommended size: 512x512px</p>
              <p className="text-xs text-text-secondary">PNG, JPG or WEBP (max 2MB)</p>
              <label
                className={`mt-2 inline-flex items-center gap-2 rounded-lg border border-border-soft px-3 py-1.5 text-sm hover:bg-white/5 ${
                  isUploadingLogo ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                }`}
              >
                {isUploadingLogo ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {isUploadingLogo ? "Uploading..." : "Change Logo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={isUploadingLogo}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Store Email" hint="Used for important notifications.">
            <input
              type="email"
              value={form.email}
              onChange={handleFieldChange("email")}
              className="input"
            />
          </Field>
        </div>

        <div className="mt-6 flex w-full justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            {saved && !isSaving && <Check size={14} />}
            {isSaving ? "Saving..." : saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </section>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border-soft);
          background: transparent;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: var(--color-content);
          outline: none;
          transition: border-color 0.15s ease;
        }
        .input:focus {
          border-color: var(--color-primary-500);
        }
      `}</style>
    </>
  )
}