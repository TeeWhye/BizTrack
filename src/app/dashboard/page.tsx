import { logout } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const businessId = user.businessId;

  const [
  sales,
  expenses,
  customerCount,
  productCount,
  products,
] = await Promise.all([
  prisma.sale.findMany({
    where: {
      businessId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  }),

  prisma.expense.findMany({
    where: {
      businessId,
    },
    orderBy: {
      createdAt: "desc",
    },
  }),

  prisma.customer.count({
    where: {
      businessId,
    },
  }),

  prisma.product.count({
    where: {
      businessId,
    },
  }),

  prisma.product.findMany({
    where: {
      businessId,
    },
    orderBy: {
      stockQuantity: "asc",
    },
  }),
]);

const lowStockProducts = products
  .filter(
    (product) =>
      product.stockQuantity <= product.lowStockThreshold
  )
  .slice(0, 5);

  const totalRevenue = sales.reduce(
    (total, sale) => total + Number(sale.totalAmount),
    0
  );

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const netProfit = totalRevenue - totalExpenses;

  const totalItemsInStock = products.reduce(
  (total, product) => total + product.stockQuantity,
  0
);

  const transactions = [
    ...sales.map((sale) => ({
      id: `sale-${sale.id}`,
      type: "sale" as const,
      title:
        sale.items.length === 1
          ? "Product Sale"
          : `${sale.items.length} Products Sold`,
      description: sale.items
        .map((item) => `${item.product.name} × ${item.quantity}`)
        .join(", "),
      amount: Number(sale.totalAmount),
      createdAt: sale.createdAt,
    })),

    ...expenses.map((expense) => ({
      id: `expense-${expense.id}`,
      type: "expense" as const,
      title: expense.description,
      description: expense.category,
      amount: Number(expense.amount),
      createdAt: expense.createdAt,
    })),
  ]
    .sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="text-2xl font-bold text-blue-600">
            BizTrack
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.name}
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r bg-white p-6 md:block">
          <nav className="space-y-2">
            <a
              href="/dashboard"
              className="block rounded-lg bg-blue-50 px-4 py-3 font-medium text-blue-600"
            >
              Dashboard
            </a>

            <a
              href="/products"
              className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50"
            >
              Products
            </a>

            <a
              href="/sales"
              className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50"
            >
              Sales
            </a>

            <a
              href="/expenses"
              className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50"
            >
              Expenses
            </a>

            <a
              href="/customers"
              className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50"
            >
              Customers
            </a>

            <a
              href="/products"
              className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50"
            >
              Inventory
            </a>

            <a
              href="/reports"
              className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50"
            >
              Reports
            </a>
          </nav>

          <div className="mt-10 border-t pt-6">
            <a
              href="/settings"
              className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50"
            >
              Settings
            </a>

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

        {/* Main Content */}
        <section className="flex-1 p-6 md:p-8">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Here's what's happening with your business today.
            </p>
          </div>

{/* Statistics */}
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
  {/* Revenue */}
  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Total Revenue
    </p>
    <p className="mt-2 text-2xl font-bold text-gray-900">
      ₦{totalRevenue.toLocaleString()}
    </p>
    <p className="mt-2 text-sm text-gray-500">
      From recorded sales
    </p>
  </div>

  {/* Expenses */}
  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Total Expenses
    </p>
    <p className="mt-2 text-2xl font-bold text-gray-900">
      ₦{totalExpenses.toLocaleString()}
    </p>
    <p className="mt-2 text-sm text-gray-500">
      From recorded expenses
    </p>
  </div>

  {/* Profit */}
  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Net Profit
    </p>
    <p
      className={`mt-2 text-2xl font-bold ${
        netProfit >= 0 ? "text-green-600" : "text-red-600"
      }`}
    >
      ₦{netProfit.toLocaleString()}
    </p>
    <p className="mt-2 text-sm text-gray-500">
      Revenue minus expenses
    </p>
  </div>

  {/* Customers */}
  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Customers
    </p>
    <p className="mt-2 text-2xl font-bold text-gray-900">
      {customerCount}
    </p>
    <p className="mt-2 text-sm text-gray-500">
      Registered customers
    </p>
  </div>

  {/* Products */}
  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Products
    </p>
    <p className="mt-2 text-2xl font-bold text-gray-900">
      {productCount}
    </p>
    <p className="mt-2 text-sm text-gray-500">
      Products in inventory
    </p>
  </div>

  {/* Stock */}
  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Items in Stock
    </p>
    <p className="mt-2 text-2xl font-bold text-gray-900">
      {totalItemsInStock}
    </p>
    <p className="mt-2 text-sm text-gray-500">
      Total units available
    </p>
  </div>
</div>


          {/* Recent Transactions */}
          <div className="mt-8 rounded-xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Transactions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your latest business activity
                </p>
              </div>

              <a
                href="/sales/new"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Add Transaction
              </a>
            </div>

            {/* Transactions */}
            <div className="divide-y">
              {transactions.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  No transactions yet.
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-6"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.title}
                      </p>

                      <p className="text-sm text-gray-500">
                        {transaction.description}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {transaction.createdAt.toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`font-medium ${
                        transaction.type === "sale"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "sale" ? "+" : "-"}₦
                      {transaction.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        {/* Low Stock Alert */}
<div className="mt-8 rounded-xl border bg-white shadow-sm">
  <div className="flex items-center justify-between border-b p-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        Low Stock Alert
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Products that may need restocking.
      </p>
    </div>

    <a
      href="/products"
      className="text-sm font-medium text-blue-600 hover:text-blue-700"
    >
      View Inventory →
    </a>
  </div>

  {lowStockProducts.length === 0 ? (
    <div className="p-6 text-center">
      <p className="text-sm font-medium text-green-600">
        Inventory looks good.
      </p>
      <p className="mt-1 text-sm text-gray-500">
        No products are currently below their stock threshold.
      </p>
    </div>
  ) : (
    <div className="divide-y">
      {lowStockProducts.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between p-6"
        >
          <div>
            <p className="font-medium text-gray-900">
              {product.name}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              SKU: {product.sku}
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold text-red-600">
              {product.stockQuantity} left
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Threshold: {product.lowStockThreshold}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


        </section>
      </div>
    </main>
  );
}