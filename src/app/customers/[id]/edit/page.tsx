import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateCustomer } from "@/app/customers/actions/action";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const customer = await prisma.customer.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  });

  if (!customer) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-3xl">
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

  const updateCustomerWithId = updateCustomer.bind(null, customer.id);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/customers/${customer.id}`}
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Back to Customer
        </Link>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Customer
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update {customer.name}'s customer information.
            </p>
          </div>

          <form action={updateCustomerWithId} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Customer Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                defaultValue={customer.name}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={customer.phone ?? ""}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                defaultValue={customer.email ?? ""}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                rows={4}
                defaultValue={customer.address ?? ""}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
              <Link
                href={`/customers/${customer.id}`}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
