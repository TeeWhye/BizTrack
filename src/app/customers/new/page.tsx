import Link from "next/link";
import { createCustomer } from "../actions/action";

export default function NewCustomerPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">

          <Link
            href="/customers"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Customers
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Add Customer
          </h1>

          <p className="mt-1 text-gray-500">
            Add a customer to your business records.
          </p>

        </div>

        {/* Form */}
        <form
  action={createCustomer}
  className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
>

          {/* Name */}
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
              placeholder="e.g. John Doe"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />

          </div>

          {/* Phone */}
          <div className="mt-6">

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
              placeholder="e.g. 08012345678"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />

          </div>

          {/* Email */}
          <div className="mt-6">

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
              placeholder="e.g. john@example.com"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />

          </div>

          {/* Address */}
          <div className="mt-6">

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
              placeholder="Customer address"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />

          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">

            <Link
              href="/customers"
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Add Customer
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}