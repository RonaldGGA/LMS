"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Users, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility class merger
import { useUserSession } from "@/app/hooks/useUserSession";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const session = useUserSession();

  const navigation = [
    {
      name: "Manage Books",
      href: "/dashboard/books",
      icon: Book,
      current: pathname.startsWith("/dashboard/books"),
    },
    {
      name: "Manage Users",
      href: "/dashboard/users",
      icon: Users,
      current: pathname.startsWith("/dashboard/users"),
    },
  ];

  return (
    <div className="">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-14 right-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-all duration-300 ease-in-out",
          "lg:translate-x-0 lg:sticky lg:top-[97px]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4 ">
          {/* Logo */}
          <div className="mb-8 px-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h2>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-colors",
                  item.current
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 mr-3",
                    item.current ? "text-blue-600" : "text-gray-500"
                  )}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Profile Section (optional) */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center px-2">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">AD</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {session?.name ? session.name : "Admin User"}{" "}
                </p>
                <p className="text-sm text-gray-500">
                  {session?.role ? session.role : "Administrator"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
