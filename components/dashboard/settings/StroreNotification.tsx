"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export default function StoreNotification() {
  return (
    <div>
      <div className="mt-6 w-full space-y-4">

        {/* Notifications */}
        <section
          className="w-full rounded-xl border border-border-soft bg-card p-4 sm:p-6"
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
      </div>
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