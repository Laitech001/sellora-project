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
}

export default function TextInput({id, type, placeholder, name, value, accept, onChange, size = 'medium', radius = 'base', className }: TextInputProps) {

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

  const classes = `${sizeClasses[size]} ${radiusclasses[radius]} w-full mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`;

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