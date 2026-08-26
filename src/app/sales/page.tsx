import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import SalesFilters from "./SalesFilters";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const businessId = user.businessId;

  const sales = await prisma.sale.findMany({
    where: {
      businessId,
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalRevenue = sales.reduce(
    (total, sale) => total + Number(sale.totalAmount),
    0
  );

  const totalItemsSold = sales.reduce(
    (total, sale) =>
      total +
      sale.items.reduce(
        (itemTotal, item) => itemTotal + item.quantity,
        0
      ),
    0
  );

  const serializedSales = sales.map((sale) => ({
    id: sale.id,
    createdAt: sale.createdAt.toISOString(),
    totalAmount: Number(sale.totalAmount),

    customer: sale.customer
      ? {
          id: sale.customer.id,
          name: sale.customer.name,
        }
      : null,

    items: sale.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),

      product: {
        id: item.product.id,
        name: item.product.name,
      },
    })),
  }));

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Sales
            </h1>

            <p className="mt-1 text-gray-500">
              Track your sales and transactions.
            </p>
          </div>

          <a
            href="/sales/new"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Record Sale
          </a>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Sales
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {sales.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Items Sold
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalItemsSold}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Revenue
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              ₦{totalRevenue.toLocaleString()}
            </p>
          </div>

        </div>

        {/* Interactive Sales */}
        <SalesFilters sales={serializedSales} />

      </div>
    </main>
  );
}