"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { logout } from "@/app/actions/auth";

const hiddenRoutes = [
  "/",
  "/dashboard",
  "/settings",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Products", href: "/products" },
  { name: "Sales", href: "/sales" },
  { name: "Expenses", href: "/expenses" },
  { name: "Customers", href: "/customers" },
  { name: "Inventory", href: "/inventory" },
  { name: "Reports", href: "/reports" },
  { name: "Settings", href: "/settings" },
];

export default function ConditionalHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-blue-600"
          >
            BizTrack
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 transition hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/10 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-gray-200 bg-white p-6 shadow-lg transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            BizTrack
          </span>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navigation.map((item) => (
            <Link
                  key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <form action={logout} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </form>
      </aside>
    </>
  );
}