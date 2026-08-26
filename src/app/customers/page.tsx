import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import CustomerFilters from "./CustomerFilters";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const businessId = user.businessId;

  const customers = await prisma.customer.findMany({
    where: {
      businessId,
    },
    include: {
      sales: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Customers
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your customers and their purchase history.
            </p>
          </div>

          <a
            href="/customers/new"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add Customer
          </a>
        </div>

        <CustomerFilters
  customers={customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    salesCount: customer.sales.length,
    totalSpent: customer.sales.reduce(
      (total, sale) => total + Number(sale.totalAmount),
      0
    ),
  }))}
/>
      </div>
    </main>
  );
}