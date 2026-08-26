import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            BizTrack
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Create Account
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Business Management Made Simple
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Manage your business from one place.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            BizTrack helps you manage sales, inventory, expenses,
            customers and business performance without the complexity.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to run your business.
            </h2>

            <p className="mt-3 text-gray-600">
              Keep your important business information organized
              and accessible in one place.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Sales
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Record transactions and keep track of your revenue.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Inventory
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Manage products, stock levels and low-stock items.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Expenses
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Track business spending and understand where your money goes.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Customers
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Keep customer records and review their purchase history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to take control of your business?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-300">
            Create your BizTrack account and start managing your
            business more efficiently.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <p className="text-sm text-gray-500">
            © 2026 BizTrack. All rights reserved.
          </p>

          <div className="flex gap-4 text-sm">
            <Link
              href="/login"
              className="text-gray-500 hover:text-gray-900"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="text-gray-500 hover:text-gray-900"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}