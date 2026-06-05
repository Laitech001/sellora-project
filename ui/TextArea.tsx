type TextAreaProps = {
  id?: string;
  placeholder?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  variant?: 'default' | 'light';
}

export default function TextInput({id, placeholder, name, value, onChange, size = 'medium', className, variant = 'default' }: TextAreaProps) {

  const sizeClasses  = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  const variantClasses = {
    default: 'border border-slate-700 text-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
    light: 'bg-white text-gray-800 border border-gray-300'
  }

  const classes = `${sizeClasses[size]} ${variantClasses[variant]} w-full mb-4 font-light border border-gray-300 rounded ${className || ''}`;
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className={classes}
    />

  )
}