"use client";

import { useState } from "react";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import {
  Store,
  Link2,
  Bell,
  Upload,
  Copy,
  ExternalLink,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";

export type storeSettingDataProps = {
  name: string;
  whatsapp_number: string;
  email: string;
  slug: string;
  logo_url: string;
}

type SettingsPageProps = {
  store: storeSettingDataProps;
  storeBaseUrl?: string; // e.g. "sellora.store"
  onLogoChange?: (file: File) => Promise<void> | void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function SettingsPage({
  store,
  storeBaseUrl = baseUrl,
  onLogoChange,
}: SettingsPageProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: store.name,
    whatsapp_number: store.whatsapp_number,
    email: store.email ?? "",
  });
  const [logoPreview, setLogoPreview] = useState(store.logo_url ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

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

  const storeUrl = `${storeBaseUrl}/store/${store.slug}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${storeUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/stores/${store.slug}/store`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || "Failed to delete store");
      }

      toast.success("Store deleted successfully");
      setShowDeleteModal(false);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete store"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Content */}
        <div className="space-y-4">
          {/* Store Information */}
          <section
            className="rounded-xl border border-border-soft bg-card p-6"
          >
            <div className="mb-6 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600/20 text-primary-400">
                <Store size={18} />
              </span>
              <div>
                <h2 className="font-semibold">Store Information</h2>
                <p className="text-sm text-text-secondary">Update your store's basic information.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-border-soft bg-circle-background">
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

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Store Email (Optional)" hint="Used for important notifications.">
                <input
                  type="email"
                  value={form.email}
                  onChange={handleFieldChange("email")}
                  className="input"
                />
              </Field>
            </div>

            <div className="mt-6 w-full flex justify-start">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg border border-border-soft px-4 py-2 text-sm font-medium text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                {saved && !isSaving && <Check size={14} />}
                {isSaving ? "Saving..." : saved ? "Saved" : "Save Changes"}
              </button>
            </div>
          </section>

          {/* Store Link */}
          <section
            className="rounded-xl border border-border-soft bg-card p-6"
          >
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600/20 text-primary-400">
                <Link2 size={18} />
              </span>
              <div>
                <h2 className="font-semibold">Store Link</h2>
                <p className="text-sm text-text-secondary">This is your store's unique link. Share it with your customers.</p>
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium">Store URL</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center justify-between rounded-lg border border-border-soft bg-transparent px-3 py-2.5 text-sm">
                <span>{storeUrl}</span>
                <button onClick={handleCopyLink} className="text-text-secondary hover:text-content">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <a
                href={`${storeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-border-soft px-4 py-2.5 text-sm font-medium hover:bg-white/5"
              >
                Preview Store <ExternalLink size={14} />
              </a>
            </div>
          </section>

          {/* Notifications */}
          {/* <section
            className="rounded-xl border border-border-soft bg-card p-6"
          >
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600/20 text-primary-400">
                <Bell size={18} />
              </span>
              <div>
                <h2 className="font-semibold">Notifications</h2>
                <p className="text-sm text-text-secondary">Manage order notifications.</p>
              </div>
            </div>

            <ToggleRow label="New order alerts" description="Get notified when a customer places an order." defaultChecked />
            <ToggleRow label="Low stock alerts" description="Get notified when a product is running low." defaultChecked />
          </section> */}

          {/* Danger Zone */}
          <section
            className="rounded-xl border border-border-soft bg-red-950/10 p-6"
          >

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-950/40 text-red-400">
                  <Trash2 size={18} />
                </span>
                <div>
                  <h2 className="font-semibold text-red-400">Delete Store</h2>
                  <p className="text-sm text-text-secondary">
                    Permanently delete your store and all associated products and orders.
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
              >
                <Trash2 size={14} />
                Delete Store
              </button>
            </div>
          </section>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border-soft bg-card p-6">
            <h3 className="font-semibold text-red-400">Delete this store?</h3>
            <p className="mt-2 text-sm text-text-secondary">
              This will permanently delete "{store.name}" and all its products, orders, and data. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-border-soft px-4 py-2 text-sm hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
              >
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                {isDeleting ? "Deleting..." : "Yes, delete store"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-text-secondary">{hint}</p>}
    </div>
  );
}

function ToggleRow({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between border-t border-border-soft py-4 first:border-t-0 first:pt-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
      <button
        onClick={() => setChecked((c) => !c)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary-600" : "bg-circle-background"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}