import Link from "next/link";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold text-blue-600"
          >
            BizTrack
          </Link>

          <p className="mt-2 text-gray-600">
            Reset your BizTrack password
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

          <h1 className="text-2xl font-semibold text-gray-900">
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Enter the email address associated with your account and
            we'll help you reset your password.
          </p>

          <form action={requestPasswordReset} className="mt-6 space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
            >
              Send Reset Link
            </button>

          </form>

          {/* Back to Login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}

            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Back to login
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}