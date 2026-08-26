import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { deleteExpense } from "./actions/actions";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const businessId = user.businessId;

  const expenses = await prisma.expense.findMany({
    where: {
      businessId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Expenses
            </h1>

            <p className="mt-1 text-gray-500">
              Track your business expenses and spending.
            </p>
          </div>

          <Link
            href="/expenses/new"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add Expense
          </Link>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Expenses
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              ₦{totalExpenses.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Number of Expenses
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {expenses.length}
            </p>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Expenses
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your latest business expenses.
            </p>
          </div>

          {expenses.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-medium text-gray-900">
                No expenses yet.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first expense to start tracking your spending.
              </p>

              <Link
                href="/expenses/new"
                className="mt-5 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Add Expense
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Description
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {expense.createdAt.toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {expense.description}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {expense.category}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₦{Number(expense.amount).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">

                          {/* Edit */}
                          <Link
                            href={`/expenses/${expense.id}/edit`}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </Link>

                          {/* Delete */}
                          <form
                            action={deleteExpense.bind(
                              null,
                              expense.id
                            )}
                          >
                            <button
                              type="submit"
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </form>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}