import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const products = await prisma.product.findMany({
    where: {
      businessId: user.businessId,
    },
    orderBy: {
      name: "asc",
    },
  });

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.stockQuantity,
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      product.stockQuantity > 0 &&
      product.stockQuantity <= product.lowStockThreshold
  );

  const outOfStockProducts = products.filter(
    (product) => product.stockQuantity <= 0
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Inventory
          </h1>

          <p className="mt-1 text-gray-500">
            Monitor your stock levels and inventory status.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Products
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {totalStock}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Low Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-600">
              {lowStockProducts.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Out of Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {outOfStockProducts.length}
            </p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    SKU
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const isOutOfStock = product.stockQuantity <= 0;

                  const isLowStock =
                    !isOutOfStock &&
                    product.stockQuantity <= product.lowStockThreshold;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {product.sku}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {product.stockQuantity}
                      </td>

                      <td className="px-6 py-4">
                        {isOutOfStock ? (
                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            Out of stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                            Low stock
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            In stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">
                No products found in your inventory.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}