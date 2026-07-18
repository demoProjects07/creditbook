"use client";

import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import { getDashboard } from "@/services/dashboard.service";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const recentBills = dashboard?.recentBills ?? [];
  const recentPayments = dashboard?.recentPayments ?? [];
  const topCustomers = dashboard?.topCustomers ?? [];

  async function loadDashboard() {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!dashboard) {
    return (
      <AppLayout>
        <p>Loading dashboard...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-blue-50 p-6 shadow-sm">
            <p className="text-gray-500">
              Customers
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {dashboard.totalCustomers}
            </h2>
          </div>

          <div className="rounded-xl bg-red-50 p-6 shadow-sm">
            <p className="text-gray-500">
              Bills
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              ₹{dashboard.totalBills.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-xl bg-green-50 p-6 shadow-sm">
            <p className="text-gray-500">
              Payments
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              ₹{dashboard.totalPayments.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-xl bg-yellow-50 p-6 shadow-sm">
            <p className="text-gray-500">
              Outstanding
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-700">
              ₹{dashboard.totalOutstanding.toLocaleString()}
            </h2>
          </div>

        </div>

        {/* Recent Bills + Top Customers */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-xl font-bold">
              Recent Bills
            </h2>

            {recentBills.length === 0 ? (
              <p className="text-gray-500">
                No bills available.
              </p>
            ) : (
              <div className="space-y-3">
                {recentBills.map((bill: any) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-semibold">
                        {bill.customer.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {bill.note || "No note"}
                      </p>
                    </div>

                    <p className="font-bold text-red-600">
                      ₹{bill.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-xl font-bold">
              Top Outstanding Customers
            </h2>

            {topCustomers.length === 0 ? (
              <p className="text-gray-500">
                No customers found.
              </p>
            ) : (
              <div className="space-y-3">
                {topCustomers.map((customer: any) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <p className="font-semibold">
                      {customer.name}
                    </p>

                    <p className="font-bold text-red-600">
                      ₹{customer.outstanding.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Recent Payments */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-4 text-xl font-bold">
            Recent Payments
          </h2>

          {recentPayments.length === 0 ? (
            <p className="text-gray-500">
              No payments available.
            </p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment: any) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-semibold">
                      {payment.customer.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {payment.note || "Payment"}
                    </p>
                  </div>

                  <p className="font-bold text-green-600">
                    ₹{payment.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </AppLayout>
  );
}