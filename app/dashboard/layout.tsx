import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen text-gray-900 bg-white">

      <section className="h-full sticky top-0 left-0">
        <Sidebar />
      </section>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <Header />
        {children}
      </main>

    </div>
  );
}