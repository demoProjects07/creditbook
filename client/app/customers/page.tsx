"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import CustomerCard from "@/features/customers/components/CustomerCard";
import { getCustomers } from "@/services/customer.service";
import AddCustomerDialog from "@/features/customers/components/AddCustomerDialog";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  async function loadCustomers() {
    try {
      setLoading(true);

      const data = await getCustomers();

      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);
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

          <AddCustomerDialog
            onCustomerAdded={loadCustomers}
          />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search customer..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />
        {loading && (
          <p className="text-gray-500">
            Loading customers...
          </p>
        )}
        {/* Customer List */}
        <div className="space-y-4">
          {!loading &&
            customers.map((customer) => (
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