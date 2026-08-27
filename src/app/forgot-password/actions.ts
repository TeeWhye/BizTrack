"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!email) {
    throw new Error("Email address is required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Don't reveal whether the email exists.
  if (!user) {
    return;
  }

  // Generate a secure random token.
  const token = crypto.randomBytes(32).toString("hex");

  // Hash the token before storing it in the database.
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Token expires after 1 hour.
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  // Remove previous reset tokens for this user.
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
    },
  });

  // Store only the hashed token.
  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  // Create the password reset URL.
  const resetUrl =
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}` +
    `/reset-password?token=${token}`;

  // Send the password reset email.
  await resend.emails.send({
    from: "BizTrack <onboarding@resend.dev>",
    to: user.email,
    subject: "Reset your BizTrack password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #2563eb; margin-bottom: 24px;">
          BizTrack
        </h1>

        <h2 style="color: #111827;">
          Reset your password
        </h2>

        <p style="color: #4b5563; line-height: 1.6;">
          We received a request to reset the password for your BizTrack account.
        </p>

        <p style="color: #4b5563; line-height: 1.6;">
          Click the button below to create a new password.
        </p>

        <div style="margin: 32px 0;">
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          This password reset link will expire in 1 hour.
        </p>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you did not request a password reset, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

        <p style="color: #9ca3af; font-size: 12px;">
          © 2026 BizTrack. All rights reserved.
        </p>
      </div>
    `,
  });
}