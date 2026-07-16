export default function Header() {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      {/* Left Side */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          CreditBook
        </h1>
      </div>

      {/* Center */}
      <div className="w-96">
        <input
          type="text"
          placeholder="Search customer..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right Side */}
      <div className="font-medium text-gray-700">
        Admin
      </div>
    </header>
  );
}