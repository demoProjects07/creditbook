"use client";

import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";

import {
  getArchivedCustomers,
  restoreCustomer,
} from "@/services/customer.service";

export default function ArchivedCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);

  async function loadCustomers() {
    try {
      const data = await getArchivedCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRestore(id: string) {
    const confirmed = confirm(
      "Restore this customer?"
    );

    if (!confirmed) return;

    try {
      await restoreCustomer(id);

      alert("Customer restored successfully.");

      loadCustomers();
    } catch (error: any) {
      alert(error.message);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <h1 className="text-3xl font-bold">
            Archived Customers
          </h1>

        </div>

        {customers.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <p className="text-gray-500">
              No archived customers.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">

            {customers.map((customer) => (

              <div
                key={customer.id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    {customer.photo ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${customer.photo}`}
                        alt={customer.name}
                        className="h-16 w-16 rounded-full border object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-3xl">
                        👤
                      </div>
                    )}

                    <div>

                      <h2 className="text-xl font-semibold">
                        {customer.name}
                      </h2>

                      <p className="text-gray-500">
                        {customer.mobile}
                      </p>

                      <p className="text-sm text-gray-500">
                        {customer.customerCode}
                      </p>

                      <p className="mt-1 font-semibold text-red-600">
                        Outstanding ₹
                        {customer.outstanding.toLocaleString()}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      handleRestore(customer.id)
                    }
                    className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                  >
                    Restore
                  </button>

                </div>
              </div>

            ))}

          </div>
        )}

      </div>
    </AppLayout>
  );
}