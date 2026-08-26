"use client";

import { useState } from "react";
import DeleteProductButton from "./DeleteProductButton";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string | null;
  stockQuantity: number;
  lowStockThreshold: number;
  sellingPrice: number;
};

type ProductFiltersProps = {
  products: Product[];
};

export default function ProductFilters({
  products,
}: ProductFiltersProps) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState("all");
  const [stockStatus, setStockStatus] = useState("all");

  const categories = Array.from(
    new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    )
  );

  const filteredProducts = products.filter((product) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm);

    const matchesCategory =
      category === "all" || product.category === category;

    let matchesStock = true;

    if (stockStatus === "out") {
      matchesStock = product.stockQuantity === 0;
    }

    if (stockStatus === "low") {
      matchesStock =
        product.stockQuantity > 0 &&
        product.stockQuantity <= product.lowStockThreshold;
    }

    if (stockStatus === "in") {
      matchesStock =
        product.stockQuantity > product.lowStockThreshold;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <>
      <div className="mt-8 flex gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
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
        <div className="mt-4 flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
            >
              <option value="all">All categories</option>

              {categories.map((item) => (
                <option key={item} value={item!}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Stock status
            </label>

            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
            >
              <option value="all">All stock</option>
              <option value="in">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setStockStatus("all");
            }}
            className="self-end rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Product
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Category
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Stock
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Selling Price
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">
                    {product.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    SKU: {product.sku}
                  </p>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.category}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.stockQuantity}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ₦{Number(product.sellingPrice).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {product.stockQuantity === 0 ? (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      Out of stock
                    </span>
                  ) : product.stockQuantity <=
                    product.lowStockThreshold ? (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                      Low stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      In stock
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
  <div className="flex items-center gap-4">
    <a
      href={`/products/${product.id}/edit`}
      className="text-sm font-medium text-blue-600 hover:text-blue-800"
    >
      Edit
    </a>

    <DeleteProductButton productId={product.id} />
  </div>
</td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-sm text-gray-500"
                >
                  No products match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}