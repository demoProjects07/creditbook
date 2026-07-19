import EditPaymentDialog from "./EditPaymentDialog";
import { Payment } from "../types/payment";

type Props = {
  payment: Payment;
  onDelete: (id: string) => void;
  onUpdated: () => void;
};

export default function PaymentCard({
  payment,
  onDelete,
  onUpdated,
}: Props) {

  return (
    <div className="rounded-lg border bg-green-50 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-2xl font-bold text-green-700">
            ₹{payment.amount.toLocaleString()}
          </p>

          {payment.bill && (
            <div className="rounded-lg border bg-white p-3">

              <p className="text-sm text-gray-500">
                Applied to Bill
              </p>

              <p className="font-semibold">
                ₹{payment.bill.amount.toLocaleString()}
              </p>

              <p className="mt-2 text-green-600">
                Paid:
                <span className="font-semibold">
                  {" "}
                  ₹{payment.bill.paidAmount.toLocaleString()}
                </span>
              </p>

              <p className="text-red-600">
                Remaining:
                <span className="font-semibold">
                  {" "}
                  ₹{(
                    payment.bill.amount -
                    payment.bill.paidAmount
                  ).toLocaleString()}
                </span>
              </p>

              <div className="mt-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    payment.bill.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : payment.bill.status === "PARTIAL"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {payment.bill.status === "PAID"
                    ? "🟢 PAID"
                    : payment.bill.status === "PARTIAL"
                    ? "🟡 PARTIAL"
                    : "🔴 UNPAID"}
                </span>
              </div>

            </div>
          )}

          <p className="text-gray-600">
            {payment.note || "No note"}
          </p>

          <p className="text-sm text-gray-500">
            {new Date(payment.paymentDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>

        </div>

        <div className="flex gap-2">
          <EditPaymentDialog
            payment={payment}
            onUpdated={onUpdated}
          />

          <button
            onClick={() => onDelete(payment.id)}
            className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}