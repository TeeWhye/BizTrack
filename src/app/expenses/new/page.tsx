import Link from "next/link";
import { createExpense } from "../actions/actions";

export default function NewExpensePage() {
return ( <main className="min-h-screen bg-gray-100 p-8"> <div className="mx-auto max-w-3xl">

    {/* Header */}
    <div className="mb-8">
      <Link
        href="/expenses"
        className="text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        ← Back to Expenses
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        Add Expense
      </h1>

      <p className="mt-1 text-gray-500">
        Record a new business expense.
      </p>
    </div>

    {/* Form */}
    <form
  action={createExpense}
  className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <input
          id="description"
          name="description"
          type="text"
          placeholder="e.g. Shop electricity"
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

        <select
          id="category"
          name="category"
          required
          defaultValue=""
          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
        >
          <option value="" disabled>
            Select a category
          </option>

          <option value="Utilities">
            Utilities
          </option>

          <option value="Rent">
            Rent
          </option>

          <option value="Transportation">
            Transportation
          </option>

          <option value="Supplies">
            Supplies
          </option>

          <option value="Marketing">
            Marketing
          </option>

          <option value="Salaries">
            Salaries
          </option>

          <option value="Maintenance">
            Maintenance
          </option>

          <option value="Other">
            Other
          </option>
        </select>
      </div>

      {/* Amount */}
      <div className="mt-6">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>

        <div className="relative mt-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            ₦
          </span>

          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            required
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-gray-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-4">

        <Link
          href="/expenses"
          className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Expense
        </button>

      </div>

    </form>

  </div>
</main>

);
}
