import Header from '@/components/store/layout/Header'
import { getStoreBySlug } from '@/lib/data/store';
import { notFound } from 'next/navigation';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>
}

export default async function StorePageLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  console.log(slug);

  if (!store) {
    notFound();
  }
  return (
    <div className='min-h-screen bg-gray-50 text-gray-900'>
      <Header store={store}/>

      <main>
        {children}
      </main>
    </div>
  )
}