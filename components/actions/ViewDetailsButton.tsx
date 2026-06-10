import { Eye } from 'lucide-react';

type ViewDetailsButtonProps = {
  onClick: () => void
}

export default function ViewDetailsButton({ onClick }: ViewDetailsButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="bg-transparent border border-slate-500 text-content px-2 py-1 rounded inline-flex items-center justify-center cursor-pointer hover:bg-slate-800"
    >
      <Eye size={18} />
    </button>
  )
}