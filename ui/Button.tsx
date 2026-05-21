
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  varient?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({ children, onClick, varient = 'primary', size = 'medium', type = 'button', loading = false, disabled = false, className }: ButtonProps) {

  const varientClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 border border-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 border border-red-500',
  }

  const sizeClasses  = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-3 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  const isDisabled = disabled || loading;

  const baseClasses = `${varientClasses[varient]} ${sizeClasses[size]} rounded cursor-pointer ${className || ''}`;

  const disabledClasses = isDisabled
  ? "opacity-50 cursor-not-allowed"
  : "hover:opacity-90";

  return (
    <button onClick={onClick} className={`${baseClasses} ${disabledClasses}`} disabled={isDisabled}>
      {loading && (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
      )}
      <span>{children}</span>
    </button>
  )
}