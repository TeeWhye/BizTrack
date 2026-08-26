import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateProduct } from "@/app/products/actions/actions";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const businessId = user.businessId;

  const product = await prisma.product.findFirst({
    where: {
      id,
      businessId,
    },
  });

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900">
            Product not found
          </h1>

          <a
            href="/products"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Products
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <a
            href="/products"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Products
          </a>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Edit Product
          </h1>

          <p className="mt-1 text-gray-500">
            Update the details of {product.name}.
          </p>
        </div>

        {/* Form */}
        <form
          action={updateProduct}
          className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          <input type="hidden" name="id" value={product.id} />

          {/* Product name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              defaultValue={product.name}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />
          </div>

          {/* Category + SKU */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                defaultValue={product.category}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="sku"
                className="block text-sm font-medium text-gray-700"
              >
                SKU
              </label>

              <input
                id="sku"
                name="sku"
                type="text"
                defaultValue={product.sku}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Prices */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="costPrice"
                className="block text-sm font-medium text-gray-700"
              >
                Cost price
              </label>

              <input
                id="costPrice"
                name="costPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={Number(product.costPrice)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="sellingPrice"
                className="block text-sm font-medium text-gray-700"
              >
                Selling price
              </label>

              <input
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={Number(product.sellingPrice)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Inventory */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="stockQuantity"
                className="block text-sm font-medium text-gray-700"
              >
                Current stock
              </label>

              <input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                defaultValue={product.stockQuantity}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="lowStockThreshold"
                className="block text-sm font-medium text-gray-700"
              >
                Low-stock threshold
              </label>

              <input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                defaultValue={product.lowStockThreshold}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <a
              href="/products"
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </a>

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}