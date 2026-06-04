import { Sidebar } from "@/components/dashboard/layout";
import { Header } from "@/components/dashboard/layout";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark text-gray-200">

      <Sidebar />

      <main className="lg:ml-60">
        <Header />
        <div className='p-2'>
          {children}
        </div>
      </main>

    </div>
  );
}