"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "./actions";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
        Invalid or missing password reset token.
      </div>
    );
  }

  async function handleSubmit(formData: FormData) {
    setError("");

    try {
      await resetPassword(formData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <form action={handleSubmit} className="mt-6 space-y-5">

      {/* Token */}
      <input type="hidden" name="token" value={token} />

      {/* New Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Enter your new password"
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          placeholder="Confirm your new password"
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
      >
        Reset Password
      </button>
    </form>
  );
}