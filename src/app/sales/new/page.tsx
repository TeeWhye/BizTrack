import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import SaleForm from "./SaleForm";

export const dynamic = "force-dynamic";

export default async function NewSalePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const businessId = user.businessId;

  const products = await prisma.product.findMany({
    where: {
      businessId,
      stockQuantity: {
        gt: 0,
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const customers = await prisma.customer.findMany({
    where: {
      businessId,
    },
    orderBy: {
      name: "asc",
    },
  });

  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    sellingPrice: product.sellingPrice.toString(),
    stockQuantity: product.stockQuantity,
  }));

  const serializedCustomers = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
  }));

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/sales"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Sales
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Record Sale
          </h1>

          <p className="mt-1 text-gray-500">
            Add products to the transaction and record the sale.
          </p>
        </div>

        <SaleForm
          products={serializedProducts}
          customers={serializedCustomers}
        />
      </div>
    </main>
  );
}

