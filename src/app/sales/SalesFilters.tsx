"use client";

import { useState } from "react";

type Sale = {
  id: string;
  createdAt: string;
  totalAmount: number;

  customer: {
    id: string;
    name: string;
  } | null;

  items: {
    id: string;
    quantity: number;
    unitPrice: number;

    product: {
      id: string;
      name: string;
    };
  }[];
};

type SalesFiltersProps = {
  sales: Sale[];
};

export default function SalesFilters({
  sales,
}: SalesFiltersProps) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [customer, setCustomer] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const customers = Array.from(
    new Map(
      sales
        .filter((sale) => sale.customer)
        .map((sale) => [
          sale.customer!.id,
          sale.customer!.name,
        ])
    ).entries()
  );

  const filteredSales = sales.filter((sale) => {
    const searchTerm = search.toLowerCase().trim();

    const customerName =
      sale.customer?.name.toLowerCase() ?? "walk-in customer";

    const productNames = sale.items
      .map((item) => item.product.name.toLowerCase())
      .join(" ");

    const matchesSearch =
      searchTerm === "" ||
      customerName.includes(searchTerm) ||
      productNames.includes(searchTerm);

    const matchesCustomer =
      customer === "all" ||
      sale.customer?.id === customer;

    let matchesDate = true;

    if (dateFilter !== "all") {
      const saleDate = new Date(sale.createdAt);
      const now = new Date();

      if (dateFilter === "today") {
        matchesDate =
          saleDate.toDateString() === now.toDateString();
      }

      if (dateFilter === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        matchesDate = saleDate >= sevenDaysAgo;
      }

      if (dateFilter === "30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        matchesDate = saleDate >= thirtyDaysAgo;
      }
    }

    return (
      matchesSearch &&
      matchesCustomer &&
      matchesDate
    );
  });

  return (
    <>
      {/* Search + Filter */}
      <div className="mt-8 flex gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer or product..."
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

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-4 flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-white p-4">

          {/* Customer */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Customer
            </label>

            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
            >
              <option value="all">
                All customers
              </option>

              {customers.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Date
            </label>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
            >
              <option value="all">
                All dates
              </option>

              <option value="today">
                Today
              </option>

              <option value="7days">
                Last 7 days
              </option>

              <option value="30days">
                Last 30 days
              </option>
            </select>
          </div>

          {/* Clear */}
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCustomer("all");
              setDateFilter("all");
            }}
            className="self-end rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Result Count */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredSales.length} of {sales.length} sales
      </div>

      {/* Sales Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {filteredSales.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-gray-900">
              No sales match your filters.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
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
                  Date
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Product
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Quantity
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Unit Price
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) =>
                sale.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {sale.customer?.name ?? "Walk-in Customer"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(
                        sale.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.product.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.quantity}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      ₦{item.unitPrice.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₦{(
                        item.unitPrice * item.quantity
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

      </div>
    </>
  );
}