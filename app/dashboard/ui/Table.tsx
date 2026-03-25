type TableProps = {
  children: React.ReactNode
}

export default function Table({ children }: TableProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <table className="w-full text-sm">
        {children}
      </table>
    </div>
  )
}