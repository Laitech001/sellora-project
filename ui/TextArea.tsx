type TextAreaProps = {
  id?: string;
  placeholder?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function TextInput({id, placeholder, name, value, onChange, size = 'medium', className }: TextAreaProps) {

  const sizeClasses  = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  const classes = `${sizeClasses[size]} w-full mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`;
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