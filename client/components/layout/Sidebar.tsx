import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-blue-900 text-white">
      <div className="border-b border-blue-800 p-6">
        <h1 className="text-2xl font-bold">CreditBook</h1>
        <p className="mt-1 text-sm text-blue-200">
          Customer Credit Manager
        </p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="block rounded-lg p-3 hover:bg-blue-800"
            >
              🏠 Dashboard
            </Link>
          </li>

          <li>
            <Link
              href="/customers"
              className="block rounded-lg p-3 hover:bg-blue-800"
            >
              👥 Customers
            </Link>
          </li>

          <li>
            <Link
              href="/reports"
              className="block rounded-lg p-3 hover:bg-blue-800"
            >
              📊 Reports
            </Link>
          </li>

          <li>
            <Link
              href="/settings"
              className="block rounded-lg p-3 hover:bg-blue-800"
            >
              ⚙️ Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}