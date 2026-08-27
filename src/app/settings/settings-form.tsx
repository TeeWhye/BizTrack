"use client";

import { useState } from "react";
import { updateBusiness } from "./actions";

type SettingsFormProps = {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export default function SettingsForm({
  name,
  email,
  phone,
  address,
}: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    setSaved(false);

    try {
      await updateBusiness(formData);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form action={handleSubmit} className="p-6">
      <div className="space-y-6">
        {/* Business Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Business Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={name}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter your business name"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Business Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            defaultValue={email ?? ""}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="business@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={phone ?? ""}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="08012345678"
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Business Address
          </label>

          <textarea
            id="address"
            name="address"
            rows={4}
            defaultValue={address ?? ""}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter your business address"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <div>
          {saved && (
            <p className="text-sm font-medium text-green-600">
              ✓ Changes saved successfully
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
