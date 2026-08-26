"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createExpense(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const businessId = user.businessId;

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const category = String(
    formData.get("category") ?? ""
  ).trim();

  const amount = Number(formData.get("amount"));

  if (!description) {
    throw new Error("Expense description is required.");
  }

  if (!category) {
    throw new Error("Expense category is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Expense amount must be greater than zero.");
  }

  await prisma.expense.create({
    data: {
      description,
      category,
      amount,
      businessId,
    },
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/expenses");
}

export async function updateExpense(
  expenseId: string,
  formData: FormData
) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const category = String(
    formData.get("category") ?? ""
  ).trim();

  const amount = Number(formData.get("amount"));

  if (!description) {
    throw new Error("Expense description is required.");
  }

  if (!category) {
    throw new Error("Expense category is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Expense amount must be greater than zero.");
  }

  const expense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      businessId: user.businessId,
    },
  });

  if (!expense) {
    throw new Error("Expense not found.");
  }

  await prisma.expense.update({
    where: {
      id: expense.id,
    },
    data: {
      description,
      category,
      amount,
    },
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/expenses");
}

export async function deleteExpense(expenseId: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const expense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      businessId: user.businessId,
    },
  });

  if (!expense) {
    throw new Error("Expense not found.");
  }

  await prisma.expense.delete({
    where: {
      id: expense.id,
    },
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/expenses");
}