'use client';
import { Button } from "@/ui";

type OrderButtonProps = {
  onClick: () => void;
  className?: string;
}

export default function OrderButton({ onClick, className }: OrderButtonProps) {
  return (
    <Button onClick={onClick} className={className}>
      Order Now
    </Button>
  )
}