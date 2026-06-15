type CardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'light';
}

export default function Card({ children, className, variant = 'default'}: CardProps) {
  const variantClasses ={
    default: 'bg-card text-content border border-slate-500 rounded-xl',
    light: 'bg-white text-gray-800',
    gradient: 'bg-linear-to-r from-primary-500 to-accent-500 text-white',
  }

  return (
    <div className={`${variantClasses[variant] || ''} ${className || ''}`}>
      {children}
    </div>
  )
}