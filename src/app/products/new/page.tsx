import { createProduct } from "../actions/actions";

export default function NewProductPage() {
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
            Add Product
          </h1>

          <p className="mt-1 text-gray-500">
            Add a new product to your inventory.
          </p>
        </div>

        {/* Form */}
        <form
          action={createProduct}
          className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
        >

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
              placeholder="e.g. Coca-Cola 50cl"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />
          </div>

          {/* Category */}
          <div className="mt-6">
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
              placeholder="e.g. Beverages"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />
          </div>

          <div className="mt-6">
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
    placeholder="e.g. COKE-50CL"
    required
    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
  />
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
                placeholder="0.00"
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
                placeholder="0.00"
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />
            </div>

          </div>

          {/* Inventory */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Current stock
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                placeholder="0"
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
                placeholder="e.g. 5"
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
              Save Product
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}