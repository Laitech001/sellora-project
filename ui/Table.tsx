type TableProps = {
  children: React.ReactNode
  className?: string
  variant?: 'light' | 'default'
}

export default function Table({ children, className, variant = 'default' }: TableProps) {
  const variantClasses = {
    light: 'bg-gray-100 rounded-xl shadow-md p-4 overflow-x-auto',
    default: 'bg-card rounded-xl shadow-md p-4 overflow-x-auto',
  }
  return (
    <div className={variantClasses[variant] + (className ? ` ${className}` : '')}>
      <table className="w-full text-sm">
        {children}
      </table>
    </div>
  )
}