import Header from '@/components/store/layout/Header'

export default function StorePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-50 text-gray-900'>
      <Header />

      <main>
        {children}
      </main>
    </div>
  )
}