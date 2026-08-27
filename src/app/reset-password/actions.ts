"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redirect } from "next/navigation";

export async function resetPassword(formData: FormData) {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(
    formData.get("confirmPassword") || ""
  );

  if (!token) {
    throw new Error("Invalid or missing reset token.");
  }

  if (!password || !confirmPassword) {
    throw new Error("Please enter and confirm your new password.");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  // Hash the token so we can safely compare it with the database.
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!resetToken) {
    throw new Error("This password reset link is invalid.");
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

    throw new Error("This password reset link has expired.");
  }

  // Hash the new password using bcrypt.
const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: {
      id: resetToken.userId,
    },
    data: {
      passwordHash,
    },
  });

  // Delete the token so it cannot be reused.
  await prisma.passwordResetToken.delete({
    where: {
      id: resetToken.id,
    },
  });

  // Invalidate all existing sessions for security.
  await prisma.session.deleteMany({
    where: {
      userId: resetToken.userId,
    },
  });

  redirect("/login");
}