'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2, Loader2 } from 'lucide-react';

type DeleteStoreProps = {
  store: {
    storeSlug: string;
    storeName: string;
  }
}

export default function DeleteStore({ store }: DeleteStoreProps) {
  const router = useRouter();

  const [ showDeleteModal, setShowDeleteModal ] = useState(false);
  const [ isDeleting, setIsDeleting ] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/stores/${store.storeSlug}/store`, {
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
    <>
      <section className='w-full rounded-xl bg-red-950/10 border border-border-soft p-4 md:p-6'>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
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
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 sm:w-auto"
          >
            <Trash2 size={14} />
            Delete Store
          </button>
        </div>
      </section>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border-soft bg-card p-6">
            <h3 className="font-semibold text-red-400">Delete this store?</h3>
            <p className="mt-2 text-sm text-text-secondary">
              This will permanently delete "{store.storeName}" and all its products, orders, and data. This cannot be undone.
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
    </>
  )
}