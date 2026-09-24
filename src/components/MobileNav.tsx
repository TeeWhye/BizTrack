"use client";

import { useState } from "react";
import Link from "next/link";

import { logout } from "@/app/actions/auth";

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

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-end border-b bg-white px-4 md:hidden">
  <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Overlay */}
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
          <div className="text-xl font-bold text-blue-600">
            BizTrack
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-10 border-t pt-6">
          <form action={logout}>
            <button
              type="submit"
              className="block w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-50"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}