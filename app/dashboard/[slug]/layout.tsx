import { Sidebar } from "@/components/dashboard/layout";
import { Header } from "@/components/dashboard/layout";
import { getStoreBySlug } from "@/lib/data/store";
import { notFound } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>
}

export default async function DashboardLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark text-gray-200">

      <Sidebar store={store} />

      <main className="lg:ml-60">
        <Header store={store}/>
        <div className='p-2'>
          {children}
        </div>
      </main>

    </div>
  );
}