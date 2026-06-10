'use client'
import { Trash } from "lucide-react"

type DeleteButtonProps = {
  onClick: () => void
}

export default function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className='border border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/20 transition'
    >
      <Trash size={18} />
    </button>
  )
}
