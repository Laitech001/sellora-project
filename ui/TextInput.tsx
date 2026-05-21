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
  className?: string;
}

export default function TextInput({id, type, placeholder, name, value, accept, onChange, size = 'medium', className }: TextInputProps) {

  const sizeClasses  = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  const classes = `${sizeClasses[size]} w-full mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`;
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