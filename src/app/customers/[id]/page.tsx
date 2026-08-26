import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { deleteCustomer } from "@/app/customers/actions/action";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const businessId = user.businessId;
  const { id } = await params;

  const customer = await prisma.customer.findFirst({
    where: {
      id,
      businessId,
    },
    include: {
      sales: {
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
      },
    },
  });

  if (!customer) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/customers"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Customers
          </Link>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8">
            <h1 className="text-xl font-semibold text-gray-900">
              Customer not found
            </h1>
          </div>
        </div>
      </main>
    );
  }

  const totalSpent = customer.sales.reduce(
    (total, sale) => total + Number(sale.totalAmount),
    0
  );

  const totalItems = customer.sales.reduce(
    (total, sale) =>
      total +
      sale.items.reduce(
        (itemTotal, item) => itemTotal + item.quantity,
        0
      ),
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          href="/customers"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Back to Customers
        </Link>

{/* Customer Header */}
<div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        {customer.name}
      </h1>

      <div className="mt-3 space-y-1 text-sm text-gray-500">
        {customer.email && <p>{customer.email}</p>}
        {customer.phone && <p>{customer.phone}</p>}
        {customer.address && <p>{customer.address}</p>}
      </div>
    </div>

    <div className="flex items-center gap-3">
      <Link
        href={`/customers/${customer.id}/edit`}
        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Edit Customer
      </Link>

      {customer.sales.length === 0 ? (
        <form action={deleteCustomer.bind(null, customer.id)}>
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete Customer
          </button>
        </form>
      ) : (
        <span
          title="Customers with sales history cannot be deleted."
          className="cursor-not-allowed rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-400"
        >
          Delete Customer
        </span>
      )}
    </div>
  </div>
</div>

        {/* Summary */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Purchases
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {customer.sales.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Items Purchased
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalItems}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Spent
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              ₦{totalSpent.toLocaleString()}
            </p>
          </div>

        </div>

        {/* Purchase History */}
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Purchase History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products purchased by {customer.name}.
            </p>
          </div>

          {customer.sales.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-medium text-gray-900">
                No purchases yet.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                This customer has not made a purchase yet.
              </p>
            </div>
          ) : (
            <table className="w-full">

              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Unit Price
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {customer.sales.map((sale) =>
                  sale.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {sale.createdAt.toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.product.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.quantity}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        ₦{Number(item.unitPrice).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₦
                        {(
                          Number(item.unitPrice) * item.quantity
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          )}

        </div>
      </div>
    </main>
  );
}