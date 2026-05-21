type FormProps = {
  children: React.ReactNode;
  onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void; 
  className?: string;
}

export default function Form({ children, onSubmit, className }: FormProps) {
  return (
    <form className={`bg-white shadow-md rounded-lg m-2 p-4 ${className || ''}`} onSubmit={onSubmit}>
      {children}
    </form>
  )
}