import { Role } from "@prisma/client";
import AuthGuard from "../components/auth-guard";
import Sidebar from "./components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard admitedRoles={[Role.SUPERADMIN, Role.LIBRARIAN]}>
      <div className="min-h-screen bg-gray-50 lg:flex">
        <Sidebar />
        <main className="lg:flex-1 p-4">{children}</main>
      </div>
    </AuthGuard>
  );
}
