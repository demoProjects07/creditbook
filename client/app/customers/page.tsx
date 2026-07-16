import AppLayout from "@/components/layout/AppLayout";
import CustomerCard from "@/features/customers/components/CustomerCard";
import { customers } from "@/features/customers/data/customers";

export default function CustomersPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Customers</h2>

            <p className="text-gray-600">
              Manage all customers and their outstanding balances.
            </p>
          </div>

          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            + Add Customer
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search customer..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />

        {/* Customer List */}
        <div className="space-y-4">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}