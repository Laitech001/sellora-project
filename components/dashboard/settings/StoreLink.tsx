'use client'

import { useState } from 'react'
import {
  Link2, Check, Copy, ExternalLink
} from 'lucide-react'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type StoreLinkProps = {
  slug: string
}

export default function StoreLink({ slug }: StoreLinkProps) {

  const [ copied, setCopied ] = useState(false);

  const storeUrl = `${baseUrl}/store/${slug}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${storeUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className='w-full rounded-xl border border-border-soft bg-card p-4 md:p-6'>
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
        <div className="flex flex-1 items-center justify-between overflow-hidden rounded-lg border border-border-soft bg-transparent px-3 py-2.5 text-sm">
          <span className="truncate">{storeUrl}</span>
          <button onClick={handleCopyLink} className="shrink-0 text-text-secondary hover:text-content">
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
  )
}