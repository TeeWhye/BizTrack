"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type SaleCartItem = {
  productId: string;
  quantity: number;
};

export async function createSale(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const businessId = user.businessId;

  const customerId = String(
    formData.get("customerId") ?? ""
  ).trim();

  const cartData = String(
    formData.get("cart") ?? ""
  ).trim();

  if (!cartData) {
    throw new Error("Your sale cart is empty.");
  }

  let cart: SaleCartItem[];

  try {
    cart = JSON.parse(cartData);
  } catch {
    throw new Error("Invalid sale cart.");
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error("Your sale cart is empty.");
  }

  // Validate every cart item.
  for (const item of cart) {
    if (
      !item ||
      typeof item.productId !== "string" ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error("Invalid product or quantity.");
    }
  }

  // Combine duplicate products in the cart.
  const combinedCart = new Map<string, number>();

  for (const item of cart) {
    const currentQuantity =
      combinedCart.get(item.productId) ?? 0;

    combinedCart.set(
      item.productId,
      currentQuantity + item.quantity
    );
  }

  await prisma.$transaction(async (tx) => {
    // Make sure the selected customer belongs to this business.
    if (customerId) {
      const customer = await tx.customer.findFirst({
        where: {
          id: customerId,
          businessId,
        },
      });

      if (!customer) {
        throw new Error("Customer not found.");
      }
    }

    let totalAmount = 0;

    const saleItems: {
      productId: string;
      quantity: number;
      unitPrice: number;
    }[] = [];

    // Validate products and calculate the sale total.
    for (const [productId, quantity] of combinedCart) {
      const product = await tx.product.findFirst({
        where: {
          id: productId,
          businessId,
        },
      });

      if (!product) {
        throw new Error(
          "One of the selected products was not found."
        );
      }

      if (product.stockQuantity < quantity) {
        throw new Error(
          `Not enough stock for ${product.name}. Only ${product.stockQuantity} available.`
        );
      }

      const unitPrice = Number(product.sellingPrice);

      totalAmount += unitPrice * quantity;

      saleItems.push({
        productId: product.id,
        quantity,
        unitPrice,
      });
    }

    if (totalAmount <= 0) {
      throw new Error("Sale total must be greater than zero.");
    }

    // Create the sale.
    const sale = await tx.sale.create({
      data: {
        businessId,
        customerId: customerId || null,
        totalAmount,
      },
    });

    // Create sale items and safely reduce stock.
    for (const item of saleItems) {
      await tx.saleItem.create({
        data: {
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        },
      });

      const updatedProduct = await tx.product.updateMany({
        where: {
          id: item.productId,
          businessId,
          stockQuantity: {
            gte: item.quantity,
          },
        },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });

      if (updatedProduct.count !== 1) {
        throw new Error(
          "Stock changed before the sale could be completed. Please try again."
        );
      }
    }
  });

  // Refresh affected pages.
  revalidatePath("/sales");
  revalidatePath("/products");
  revalidatePath("/sales/new");
  revalidatePath("/dashboard");
  revalidatePath("/customers");
  revalidatePath("/reports");

  redirect("/sales");
}
