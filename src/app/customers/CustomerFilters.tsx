"use client";

import { useState } from "react";
import Link from "next/link";

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  salesCount: number;
  totalSpent: number;
};

type CustomerFiltersProps = {
  customers: Customer[];
};

export default function CustomerFilters({
  customers,
}: CustomerFiltersProps) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState("all");

  const filteredCustomers = customers.filter((customer) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm) ||
      (customer.email?.toLowerCase().includes(searchTerm) ?? false) ||
      (customer.phone?.toLowerCase().includes(searchTerm) ?? false);

    let matchesPurchaseStatus = true;

    if (purchaseStatus === "purchased") {
      matchesPurchaseStatus = customer.salesCount > 0;
    }

    if (purchaseStatus === "none") {
      matchesPurchaseStatus = customer.salesCount === 0;
    }

    return matchesSearch && matchesPurchaseStatus;
  });

  return (
    <>
      <div className="mt-8 flex gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Filter
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Purchase status
            </label>

            <select
              value={purchaseStatus}
              onChange={(e) => setPurchaseStatus(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
            >
              <option value="all">All customers</option>
              <option value="purchased">With purchases</option>
              <option value="none">No purchases</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setPurchaseStatus("all");
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredCustomers.length} of {customers.length} customers
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredCustomers.length === 0 ? (
          <div className="p-16 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No customers found.
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Phone
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Sales
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Total Spent
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {customer.name}
                    </Link>

                    {customer.email && (
                      <p className="text-sm text-gray-500">
                        {customer.email}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {customer.phone || "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {customer.salesCount}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₦{customer.totalSpent.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}