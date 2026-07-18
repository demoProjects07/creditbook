"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import CustomerCard from "@/features/customers/components/CustomerCard";
import { getCustomers } from "@/services/customer.service";
import AddCustomerDialog from "@/features/customers/components/AddCustomerDialog";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
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
  
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.customerCode.toLowerCase().includes(search.toLowerCase()) ||
    (customer.mobile || "").includes(search)
  );
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
        <div className="mt-4">
          <input
            type="text"
            placeholder="🔍 Search by name, mobile or customer code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />
        </div>
        {loading && (
          <p className="text-gray-500">
            Loading customers...
          </p>
        )}
        {/* Customer List */}
        <div className="space-y-4">
          {!loading && filteredCustomers.length === 0 ? (
            <p className="text-gray-500">
              No customers found.
            </p>
          ) : (
            filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
              />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}