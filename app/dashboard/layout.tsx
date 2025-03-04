import Sidebar from "./components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar />
      <main className="lg:flex-1 p-4">{children}</main>
    </div>
  );
}
