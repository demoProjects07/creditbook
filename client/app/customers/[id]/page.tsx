"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import { getCustomer } from "@/services/customer.service";

import BillCard from "@/features/bills/components/BillCard";
import AddBillDialog from "@/features/bills/components/AddBillDialog";
import AddPaymentDialog from "@/features/payments/components/AddPaymentDialog";
import PaymentCard from "@/features/payments/components/PaymentCard";
import { deleteBill } from "@/services/bill.service";
import { deletePayment } from "@/services/payment.service";

export default function CustomerDetailsPage() {

  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  async function loadCustomer() {
    if (!id) return;

    const customerData = await getCustomer(id);

    setCustomer(customerData);
    setBills(customerData.bills);
    setPayments(customerData.payments);
  }

  async function handleDeleteBill(id: string) {
    const confirmed = confirm(
      "Delete this bill?"
    );

    if (!confirmed) return;
    await deleteBill(id);

    loadCustomer();
  }

  async function handleDeletePayment(id: string) {
    if (!confirm("Delete this payment?")) return;

    await deletePayment(id);

    loadCustomer();
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
            <span className="font-semibold">
              {" "}
              {customer.customerCode}
            </span>
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-gray-500">Total Bills</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{customer.totalBills.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-gray-500">Payments</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{customer.totalPayments.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-gray-500">Outstanding</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{customer.outstanding.toLocaleString()}
              </p>
            </div>
          </div>

        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Bills
          </h2>

          <AddBillDialog
              customerId={id}
              onBillAdded={loadCustomer}
            />
          <AddPaymentDialog
                customerId={id}
                onPaymentAdded={loadCustomer}
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
                onDelete={handleDeleteBill}
                onUpdated={loadCustomer}
              />
            ))}
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">
            Payments
          </h2>

          {payments.length === 0 ? (
            <p className="text-gray-500">
              No payments found.
            </p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment: any) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  onDelete={handleDeletePayment}
                  onUpdated={loadCustomer}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}