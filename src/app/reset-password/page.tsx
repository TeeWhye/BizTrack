import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            BizTrack
          </h1>

          <p className="mt-2 text-gray-600">
            Create a new password for your account
          </p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

          <h2 className="text-2xl font-semibold text-gray-900">
            Reset your password
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Enter a new password below.
          </p>

          <Suspense
            fallback={
              <div className="mt-6 text-sm text-gray-500">
                Loading...
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>

        </div>
      </div>
    </main>
  );
}