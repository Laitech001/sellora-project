import Link from 'next/link'

type EmptyStateProps = {
  title: string
  description: string
  actionText?: string
  actionLink?: string
}

export default function EmptyState({title, description, actionText, actionLink}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>{title}</h1>
      <p>{description}</p>

      {actionText && actionLink && (
        <Link
          href={actionLink}
          className='py-2 px-3 bg-primary-500 text-white hover:bg-primary-500 border border-primary-500 rounded-lg transition'
        >
          {actionText}
        </Link>
      )}
    </div>
  )
}