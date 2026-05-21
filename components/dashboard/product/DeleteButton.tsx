'use client'
import { Button } from "@/ui"
import { Trash } from "lucide-react"

type DeleteButtonProps = {
  onClick: () => void
}

export default function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <Button
      onClick={onClick}
      varient="danger"
    >
      <Trash size={18} />
    </Button>
  )
}
