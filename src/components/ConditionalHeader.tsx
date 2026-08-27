"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const hiddenRoutes = [
  "/",
  "/dashboard",
  "/reports",
  "/settings",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export default function ConditionalHeader() {
  const pathname = usePathname();

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-xl font-bold text-blue-600"
        >
          BizTrack
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>

          <Link
            href="/products"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Products
          </Link>

          <Link
            href="/sales"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Sales
          </Link>

          <Link
            href="/customers"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Customers
          </Link>

          <Link
            href="/expenses"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Expenses
          </Link>

          <Link
            href="/reports"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Reports
          </Link>

          <Link
            href="/settings"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link>
        </nav>

      </div>
    </header>
  );
}