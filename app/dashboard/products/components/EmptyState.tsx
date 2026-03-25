import Link from 'next/link'

type EmptyStateProps = {
  title: string
  description: string
  actionText: string
  actionLink: string
}

export default function EmptyState({title, description, actionText, actionLink}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>{title}</h1>
      <p>{description}</p>

      <Link
        href={actionLink}
        className='py-2 px-3 bg-blue-600 text-white border border-blue-600 rounded-lg text-md hover:bg-white hover:text-blue-600 transition'
      >
        {actionText}
      </Link>
    </div>
  )
}