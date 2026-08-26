"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const hiddenRoutes = [
  "/dashboard",
  "/reports",
  "/settings",
];

export default function TopNavigation() {
  const pathname = usePathname();

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
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
  );
}