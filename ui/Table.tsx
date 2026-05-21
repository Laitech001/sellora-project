type TableProps = {
  children: React.ReactNode
  className?: string
}

export default function Table({ children, className }: TableProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        {children}
      </table>
    </div>
  )
}