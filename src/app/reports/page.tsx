import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const businessId = user.businessId;

  const [sales, expenses, customers, products] = await Promise.all([
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
        customer: true,
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

    prisma.customer.findMany({
      where: {
        businessId,
      },
      include: {
        sales: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.findMany({
      where: {
        businessId,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);


  // --------------------------------------------------
  // FINANCIAL METRICS
  // --------------------------------------------------

  const totalRevenue = sales.reduce(
    (total, sale) => total + Number(sale.totalAmount),
    0
  );

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const netProfit = totalRevenue - totalExpenses;

  const profitMargin =
    totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const averageSale =
    sales.length > 0 ? totalRevenue / sales.length : 0;

  const totalUnitsSold = sales.reduce(
    (total, sale) =>
      total +
      sale.items.reduce(
        (itemTotal, item) => itemTotal + item.quantity,
        0
      ),
    0
  );

  // --------------------------------------------------
  // EXPENSE ANALYSIS
  // --------------------------------------------------

  const expenseByCategory: Record<string, number> = {};

  expenses.forEach((expense) => {
    expenseByCategory[expense.category] =
      (expenseByCategory[expense.category] || 0) +
      Number(expense.amount);
  });

  const expenseCategories = Object.entries(expenseByCategory).sort(
    (a, b) => b[1] - a[1]
  );

  const largestExpense =
    expenseCategories.length > 0 ? expenseCategories[0] : null;

  // --------------------------------------------------
  // PRODUCT PERFORMANCE
  // --------------------------------------------------

  const productSales: Record<
    string,
    {
      name: string;
      quantity: number;
      revenue: number;
    }
  > = {};

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productSales[item.product.id]) {
        productSales[item.product.id] = {
          name: item.product.name,
          quantity: 0,
          revenue: 0,
        };
      }

      productSales[item.product.id].quantity += item.quantity;

      productSales[item.product.id].revenue +=
        Number(item.unitPrice) * item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // --------------------------------------------------
  // CUSTOMER ANALYSIS
  // --------------------------------------------------

  const customerSales = customers
  .map((customer) => {
    const totalSpent = customer.sales.reduce(
      (total, sale) => total + Number(sale.totalAmount),
      0
    );

    return {
      id: customer.id,
      name: customer.name,
      salesCount: customer.sales.length,
      totalSpent,
    };
  })
  .filter((customer) => customer.salesCount > 0)
  .sort((a, b) => b.totalSpent - a.totalSpent);

const topCustomers = customerSales.slice(0, 5);

const repeatCustomers = customerSales.filter(
  (customer) => customer.salesCount > 1
).length;

  // --------------------------------------------------
  // INVENTORY INSIGHTS
  // --------------------------------------------------

  const lowStockProducts = products.filter(
    (product) =>
      product.stockQuantity <= product.lowStockThreshold
  );

  const outOfStockProducts = products.filter(
    (product) => product.stockQuantity === 0
  );

  // --------------------------------------------------
  // RECENT SALES
  // --------------------------------------------------

  const recentSales = sales.slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="text-2xl font-bold text-blue-600">
            BizTrack
          </div>

        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r bg-white p-6 md:block">
          <nav className="space-y-2">
            <a
              href="/dashboard"
              className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50"
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
              className="block rounded-lg bg-blue-50 px-4 py-3 font-medium text-blue-600"
            >
              Reports
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-6 md:p-8">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Business Reports
            </h1>

            <p className="mt-2 text-gray-600">
              Understand your business performance and make
              better decisions from your data.
            </p>
          </div>

          {/* Financial Overview */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Revenue
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ₦{totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Expenses
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ₦{totalExpenses.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Net Profit
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${
                  netProfit >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ₦{netProfit.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Profit Margin
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${
                  profitMargin >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {profitMargin.toFixed(1)}%
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Average Sale
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ₦{averageSale.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Business Health */}
          <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Business Health
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A quick snapshot of your current business position.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">
                  Total Transactions
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {sales.length}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Units Sold
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {totalUnitsSold}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Repeat Customers
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {repeatCustomers}
                </p>
              </div>
            </div>
          </div>

          {/* Sales + Expenses */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Sales Performance */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Sales Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Key indicators from your recorded transactions.
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Total sales
                  </span>

                  <span className="font-semibold text-gray-900">
                    {sales.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Units sold
                  </span>

                  <span className="font-semibold text-gray-900">
                    {totalUnitsSold}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Average transaction
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₦{averageSale.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Revenue
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₦{totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Expense Analysis */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Expense Analysis
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Understand where your business spending is going.
              </p>

              {largestExpense ? (
                <div className="mt-6">
                  <p className="text-sm text-gray-500">
                    Largest expense category
                  </p>

                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {largestExpense[0]}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    ₦{largestExpense[1].toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="mt-6 text-sm text-gray-500">
                  No expenses recorded yet.
                </p>
              )}

              <div className="mt-6 space-y-3">
                {expenseCategories
                  .slice(0, 5)
                  .map(([category, amount]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">
                        {category}
                      </span>

                      <span className="text-sm font-semibold text-gray-900">
                        ₦{amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="mt-8 rounded-xl border bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Top-Selling Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your strongest products based on revenue generated.
              </p>
            </div>

            {topProducts.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No product sales recorded yet.
              </div>
            ) : (
              <div className="divide-y">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {product.quantity} units sold
                        </p>
                      </div>
                    </div>

                    <span className="font-semibold text-gray-900">
                      ₦{product.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Customers */}
          <div className="mt-8 rounded-xl border bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Top Customers
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Customers who have generated the most revenue.
              </p>
            </div>

            {topCustomers.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No customer purchases recorded yet.
              </div>
            ) : (
              <div className="divide-y">
                {topCustomers.map((customer, index) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {customer.salesCount} purchase
                          {customer.salesCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <span className="font-semibold text-gray-900">
                      ₦{customer.totalSpent.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inventory Insights */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Inventory Alerts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Products that may require attention.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Low-stock products
                  </span>

                  <span className="font-semibold text-orange-600">
                    {lowStockProducts.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Out-of-stock products
                  </span>

                  <span className="font-semibold text-red-600">
                    {outOfStockProducts.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Total products
                  </span>

                  <span className="font-semibold text-gray-900">
                    {products.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Transactions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest recorded sales.
              </p>

              <div className="mt-6 space-y-4">
                {recentSales.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No transactions yet.
                  </p>
                ) : (
                  recentSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {sale.customer?.name ??
                            "Walk-in Customer"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {sale.createdAt.toLocaleDateString()}
                        </p>
                      </div>

                      <span className="font-semibold text-gray-900">
                        ₦{Number(sale.totalAmount).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
