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
import EditCustomerDialog from "@/features/customers/components/EditCustomerDialog";
import { deleteCustomer } from "@/services/customer.service";
import { useRouter } from "next/navigation";

export default function CustomerDetailsPage() {

  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);

  const router = useRouter();
  async function loadCustomer() {
    if (!id) return;

    const customerData = await getCustomer(id);

    setCustomer(customerData);
    setBills(customerData.bills);
    setPayments(customerData.payments);
    setLedger(customerData.ledger || []);
  }

  async function handleDeleteBill(id: string) {
    const bill = bills.find((b) => b.id === id);

    if (!bill) return;

    let message = `Delete bill of ₹${bill.amount.toLocaleString()}?`;

    if (bill.payments?.length > 0) {
      const totalPaid = bill.payments.reduce(
        (sum: number, payment: any) => sum + payment.amount,
        0
      );

      message += `

  This bill has ${bill.payments.length} payment(s).

  Total Paid: ₹${totalPaid.toLocaleString()}

  Deleting this bill will also delete all related payments.

  This action cannot be undone.`;
    }

    if (!confirm(message)) return;

    await deleteBill(id);

    loadCustomer();
  }

  async function handleDeletePayment(id: string) {
    if (!confirm("Delete this payment?")) return;

    await deletePayment(id);

    loadCustomer();
  }

  async function handleDeleteCustomer() {
    const confirmed = confirm(
      `Archive "${customer.name}"?\n\nThis customer will be moved to Archived Customers and can be restored later.`
    );

    if (!confirmed) return;

    try {
      await deleteCustomer(customer.id);

      alert("Customer archived successfully");

      router.push("/customers");
    } catch (error: any) {
      alert(error.message);
    }
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

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              {customer.photo ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${customer.photo}`}
                  alt={customer.name}
                  className="h-24 w-24 rounded-full border object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-4xl">
                  👤
                </div>
              )}

              <div>
                <h1 className="text-3xl font-bold">
                  {customer.name}
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
              </div>
            </div>

            <div className="flex gap-2">
              <EditCustomerDialog
                customer={customer}
                onUpdated={loadCustomer}
              />

              <div className="flex flex-col items-end">
                <button
                  onClick={handleDeleteCustomer}
                  disabled={customer.outstanding > 0}
                  title={
                    customer.outstanding > 0
                      ? "Customer has outstanding balance"
                      : "Archive customer"
                  }
                  className={`rounded-lg px-4 py-2 text-white ${
                    customer.outstanding > 0
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Archive Customer
                </button>

                {customer.outstanding > 0 && (
                  <p className="mt-2 text-right text-sm text-red-600">
                    Customer has ₹
                    {customer.outstanding.toLocaleString()} outstanding.
                    <br />
                    Clear the balance before archiving.
                  </p>
                )}
              </div>
            </div>
          </div>
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

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">
            Customer Ledger
          </h2>

          {ledger.length === 0 ? (
            <p className="text-gray-500">
              No ledger entries found.
            </p>
          ) : (
            <div className="space-y-3">
              {(() => {
                let runningBalance = 0;

                return ledger.map((entry: any) => {
                  runningBalance +=
                    entry.type === "BILL"
                      ? entry.amount
                      : -entry.amount;

                  return (
                    <div
                      key={`${entry.type}-${entry.id}`}
                      className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
                    >
                      <div>
                        <p className="font-semibold">
                          {entry.type === "BILL"
                            ? "🧾 Bill"
                            : "💰 Payment"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>

                        {entry.note && (
                          <p className="text-sm text-gray-600">
                            {entry.note}
                          </p>
                        )}

                        <p className="mt-2 text-sm font-semibold text-blue-700">
                          Balance: ₹{runningBalance.toLocaleString()}
                        </p>
                      </div>

                      <div
                        className={`text-xl font-bold ${
                          entry.type === "BILL"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {entry.type === "BILL" ? "+" : "-"}₹
                        {entry.amount.toLocaleString()}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}