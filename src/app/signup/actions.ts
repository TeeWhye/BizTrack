"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function signup(formData: FormData) {
  const name = String(formData.get("name") || "").trim();

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "");

  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const business = await prisma.business.create({
    data: {
      name: `${name}'s Business`,
    },
  });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      businessId: business.id,
    },
  });

  await createSession(user.id);

  redirect("/dashboard");
}
