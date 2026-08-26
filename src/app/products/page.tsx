import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductFilters from "./ProductFilters";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const products = await prisma.product.findMany({
    where: {
      businessId: user.businessId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Products
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your products and inventory.
            </p>
          </div>

          <a
            href="/products/new"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add Product
          </a>
        </div>

        <ProductFilters
  products={products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    stockQuantity: product.stockQuantity,
    lowStockThreshold: product.lowStockThreshold,
    sellingPrice: Number(product.sellingPrice),
  }))}
/>

        
      </div>
    </main>
  );
}