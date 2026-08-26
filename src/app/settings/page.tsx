import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateBusiness } from "./actions";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const business = await prisma.business.findUnique({
    where: {
      id: user.businessId,
    },
  });

  if (!business) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-4xl rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Business not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            We could not find the BizTrack business associated with this
            account.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="text-2xl font-bold text-blue-600">
            BizTrack
          </div>

          <a
            href="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </a>
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
              className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50"
            >
              Reports
            </a>

            <a
              href="/settings"
              className="block rounded-lg bg-blue-50 px-4 py-3 font-medium text-blue-600"
            >
              Settings
            </a>

          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-4xl">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Settings
              </h1>

              <p className="mt-2 text-gray-600">
                Manage your business information and preferences.
              </p>
            </div>

            {/* Business Profile */}
            <div className="rounded-xl border bg-white shadow-sm">

              <div className="border-b p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Business Profile
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update the information associated with your business.
                </p>
              </div>

              <form action={updateBusiness} className="p-6">

                <div className="space-y-6">

                  {/* Business Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      defaultValue={business.name}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Enter your business name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={business.email ?? ""}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="business@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={business.phone ?? ""}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="08012345678"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      rows={4}
                      defaultValue={business.address ?? ""}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Enter your business address"
                    />
                  </div>

                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end border-t pt-6">
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}