"use client";

import { ReactNode } from 'react';
import { LoadingLink } from "@/ui";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  secondaryActionText?: string;
  secondaryActionLink?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionLink,
  secondaryActionText,
  secondaryActionLink,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

      {icon && (
        <div className="mb-4 flex h-15 w-15 items-center justify-center rounded-full bg-primary-50">
          {icon}
        </div>
      )}

      <h3 className="text-base font-semibold text-content">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>

      {(actionText || secondaryActionText) && (
        <div className="mt-6 flex items-center gap-3">
          {actionText && actionLink && (
            <LoadingLink
              href={actionLink}
              className="rounded-lg bg-primary-500 px-3.5 py-2 text-sm font-medium text-white cursor-pointer transition hover:bg-primary-700"
            >
              {actionText}
            </LoadingLink>
          )}

          {secondaryActionText && secondaryActionLink && (
            <LoadingLink
              href={secondaryActionLink}
              className="rounded-lg border border-border-soft px-3.5 py-2 text-sm font-medium text-text-secondary cursor-pointer transition hover:bg-gray-50"
            >
              {secondaryActionText}
            </LoadingLink>
          )}
        </div>
      )}
    </div>
  );
}