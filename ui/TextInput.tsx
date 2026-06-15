type TextInputProps = {
  id?: string;
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string | number;
  accept?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 'small' | 'medium' | 'large';
  radius?: 'base' | 'medium' | 'full'; 
  className?: string;
  variant?: 'default' | 'light';
}

export default function TextInput({id, type, placeholder, name, value, accept, onChange, size = 'medium', radius = 'base', className, variant = 'default' }: TextInputProps) {

  const variantClasses = {
    default: 'border border-slate-700 text-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
    light: 'bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500'
  }

  const sizeClasses  = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  const radiusclasses = {
    base: 'rounded',
    medium: 'rounded-md',
    full: 'rounded-full'
  }

  const classes = `${sizeClasses[size]} ${radiusclasses[radius]} ${variantClasses[variant]} w-full mb-4 font-light ${className || ''}`;

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      accept={accept}
      onChange={onChange}
      className={classes}
    />

  )
}