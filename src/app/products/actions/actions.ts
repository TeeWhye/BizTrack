"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();

  const costPrice = Number(formData.get("costPrice"));
  const sellingPrice = Number(formData.get("sellingPrice"));
  const stockQuantity = Number(formData.get("stock"));
  const lowStockThreshold = Number(
    formData.get("lowStockThreshold")
  );

  if (!name || !category || !sku) {
    throw new Error(
      "Product name, category and SKU are required."
    );
  }

  if (
    !Number.isFinite(costPrice) ||
    costPrice < 0 ||
    !Number.isFinite(sellingPrice) ||
    sellingPrice < 0 ||
    !Number.isInteger(stockQuantity) ||
    stockQuantity < 0 ||
    !Number.isInteger(lowStockThreshold) ||
    lowStockThreshold < 0
  ) {
    throw new Error("Please enter valid product values.");
  }

  await prisma.product.create({
    data: {
      name,
      category,
      sku,
      costPrice,
      sellingPrice,
      stockQuantity,
      lowStockThreshold,
      business: {
        connect: {
          id: user.businessId,
        },
      },
    },
  });

  revalidatePath("/products");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/products");
}

export async function updateProduct(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();

  const costPrice = Number(formData.get("costPrice"));
  const sellingPrice = Number(formData.get("sellingPrice"));
  const stockQuantity = Number(formData.get("stockQuantity"));
  const lowStockThreshold = Number(
    formData.get("lowStockThreshold")
  );

  if (!id) {
    throw new Error("Product ID is required.");
  }

  if (!name || !category || !sku) {
    throw new Error(
      "Product name, category and SKU are required."
    );
  }

  if (
    !Number.isFinite(costPrice) ||
    costPrice < 0 ||
    !Number.isFinite(sellingPrice) ||
    sellingPrice < 0 ||
    !Number.isInteger(stockQuantity) ||
    stockQuantity < 0 ||
    !Number.isInteger(lowStockThreshold) ||
    lowStockThreshold < 0
  ) {
    throw new Error("Please enter valid product values.");
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      name,
      category,
      sku,
      costPrice,
      sellingPrice,
      stockQuantity,
      lowStockThreshold,
    },
  });

  revalidatePath("/products");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/products");
}

export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Product ID is required.");
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  await prisma.product.delete({
    where: {
      id: product.id,
    },
  });

  revalidatePath("/products");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/products");
}