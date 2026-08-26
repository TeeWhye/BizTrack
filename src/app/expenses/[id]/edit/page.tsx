import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateExpense } from "@/app/expenses/actions/actions";

export const dynamic = "force-dynamic";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const expense = await prisma.expense.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  });

  if (!expense) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/expenses"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Expenses
          </Link>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8">
            <h1 className="text-xl font-semibold text-gray-900">
              Expense not found
            </h1>
          </div>
        </div>
      </main>
    );
  }

  const updateExpenseWithId = updateExpense.bind(null, expense.id);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/expenses"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Back to Expenses
        </Link>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Expense
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update this business expense.
          </p>

          <form
            action={updateExpenseWithId}
            className="mt-8 space-y-6"
          >
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
                defaultValue={expense.description}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                defaultValue={expense.category}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
              >
                <option value="Utilities">Utilities</option>
                <option value="Rent">Rent</option>
                <option value="Transportation">Transportation</option>
                <option value="Supplies">Supplies</option>
                <option value="Marketing">Marketing</option>
                <option value="Salaries">Salaries</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
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
                  defaultValue={Number(expense.amount)}
                  required
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}