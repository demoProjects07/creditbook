"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import { getCustomer } from "@/services/customer.service";
import { getBills } from "@/services/bill.service";

import BillCard from "@/features/bills/components/BillCard";
import AddBillDialog from "@/features/bills/components/AddBillDialog";

export default function CustomerDetailsPage() {

  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);

  async function loadCustomer() {
    if (!id) return;

    const customerData = await getCustomer(id);
    setCustomer(customerData);
    const billData = await getBills(id);
    setBills(billData);
  }

  useEffect(() => {
    loadCustomer();
  }, [id]);

  if (!customer) {
    return (
      <AppLayout>
        <p>Loading...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h1 className="text-3xl font-bold">
            👤 {customer.name}
          </h1>

          <p className="mt-2 text-gray-600">
            📞 {customer.mobile || "No mobile"}
          </p>

          <p className="mt-2 text-gray-600">
            Customer Code:
            {" "}
            <span className="font-semibold">
              {customer.customerCode}
            </span>
          </p>

        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Bills
          </h2>

          <AddBillDialog
              customerId={id}
              onBillAdded={loadCustomer}
            />
        </div>

        {bills.length === 0 ? (
          <p className="text-gray-500">
            No bills found.
          </p>
        ) : (
          <div className="space-y-3">
            {bills.map((bill: any) => (
              <BillCard
                key={bill.id}
                bill={bill}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}