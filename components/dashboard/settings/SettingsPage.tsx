"use client";

import { useEffect, useRef, useState } from "react";
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
  onSave?: (data: Omit<storeSettingDataProps, "slug" | "logo_url">) => Promise<void> | void;
  onLogoChange?: (file: File) => Promise<void> | void;
  onDeleteStore?: () => Promise<void> | void;
};

// type SectionId = "store-information" | "store-link" | "notifications" | "danger-zone";

// const NAV_ITEMS: { id: SectionId; label: string; description: string; icon: typeof Store; danger?: boolean }[] = [
//   { id: "store-information", label: "Store Information", description: "Update your store details", icon: Store },
//   { id: "store-link", label: "Store Link", description: "Manage your store link", icon: Link2 },
//   { id: "notifications", label: "Notifications", description: "Manage order notifications", icon: Bell },
//   { id: "danger-zone", label: "Danger Zone", description: "Delete your store", icon: ShieldAlert, danger: true },
// ];

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
  onSave,
  onLogoChange,
  onDeleteStore,
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

  // const [activeSection, setActiveSection] = useState<SectionId>("store-information");

  // const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
  //   "store-information": null,
  //   "store-link": null,
  //   notifications: null,
  //   "danger-zone": null,
  // });

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const visible = entries.find((e) => e.isIntersecting);
  //       if (visible) setActiveSection(visible.target.id as SectionId);
  //     },
  //     { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
  //   );

  //   Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
  //   return () => observer.disconnect();
  // }, []);

  // const scrollToSection = (id: SectionId) => {
  //   sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  // };

  const handleFieldChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoPreview(URL.createObjectURL(file));
    await onLogoChange?.(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await onSave?.(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
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
                    <img src={logoPreview} alt="Store logo" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-lg font-semibold text-content">{getInitials(form.name)}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Recommended size: 512x512px</p>
                  <p className="text-xs text-text-secondary">PNG, JPG or WEBP (max 2MB)</p>
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border-soft px-3 py-1.5 text-sm hover:bg-white/5">
                    <Upload size={14} />
                    Change Logo
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
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

            <div className="mt-6 w-full flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
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
                href={`https://${storeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-border-soft px-4 py-2.5 text-sm font-medium hover:bg-white/5"
              >
                Preview Store <ExternalLink size={14} />
              </a>
            </div>
          </section>

          {/* Notifications */}
          <section
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
          </section>

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