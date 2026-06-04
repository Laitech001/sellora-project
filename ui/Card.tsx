type CardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient';
}

export default function Card({ children, className, variant = 'default'}: CardProps) {
  const variantClasses ={
    default: 'bg-card border border-slate-500 rounded-xl',
    gradient: 'bg-linear-to-r from-primary-500 to-accent-500 text-white',
  }

  return (
    <div className={`${variantClasses[variant] || ''} ${className || ''}`}>
      {children}
    </div>
  )
}