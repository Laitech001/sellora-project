type FormProps = {
  children: React.ReactNode;
  onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void; 
  className?: string;
  variant?: 'default' | 'light';
}

export default function Form({ children, onSubmit, className, variant = 'default' }: FormProps) {

  const variantClasses = {
    default: 'bg-card border border-slate-500',
    light: 'bg-white'
  };

  return (
    <form className={`${variantClasses[variant]} shadow-md rounded-lg m-2 p-4 ${className || ''}`} onSubmit={onSubmit}>
      {children}
    </form>
  )
}