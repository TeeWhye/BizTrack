"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function createCustomer(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!name) {
    throw new Error("Customer name is required.");
  }

  await prisma.customer.create({
    data: {
      name,
      phone: phone || null,
      email: email || null,
      address: address || null,
      businessId: user.businessId,
    },
  });

  revalidatePath("/customers");
  revalidatePath("/dashboard");

  redirect("/customers");
}

export async function updateCustomer(
  customerId: string,
  formData: FormData
) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!name) {
    throw new Error("Customer name is required.");
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      businessId: user.businessId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  await prisma.customer.update({
    where: {
      id: customer.id,
    },
    data: {
      name,
      phone: phone || null,
      email: email || null,
      address: address || null,
    },
  });

  revalidatePath("/customers");
  revalidatePath(`/customers/${customerId}`);
  revalidatePath(`/customers/${customerId}/edit`);
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect(`/customers/${customerId}`);
}

export async function deleteCustomer(customerId: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      businessId: user.businessId,
    },
    include: {
      sales: true,
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  if (customer.sales.length > 0) {
    throw new Error(
      "This customer cannot be deleted because they have existing sales."
    );
  }

  await prisma.customer.delete({
    where: {
      id: customer.id,
    },
  });

  revalidatePath("/customers");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/customers");
}
