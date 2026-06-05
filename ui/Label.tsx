type LabelProps = {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  variant?: 'default' | 'light';
}

export default function Label({ children, htmlFor, className, variant = 'default' }: LabelProps) {
  const variantClasses = {
    default: 'text-base text-gray-200',
    light: 'text-base text-gray-600 font-normal',
  };

  return (
    <label htmlFor={htmlFor} className={`block mb-1 ${variantClasses[variant]} ${className || ''}`}>
      {children}
    </label>
  )
}