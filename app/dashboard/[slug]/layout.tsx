import { Sidebar } from "@/components/dashboard/layout";
import { Header } from "@/components/dashboard/layout";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      <Sidebar />

      <main className="lg:ml-60">
        <Header />
        {children}
      </main>

    </div>
  );
}