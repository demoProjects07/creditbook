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
        <div>
          <p className="text-lg font-semibold">
            ₹{payment.amount.toLocaleString()}
          </p>

          <p className="text-sm text-gray-600">
            {payment.note || "Payment"}
          </p>

          <p className="text-sm text-gray-500">
            {new Date(payment.paymentDate).toLocaleDateString()}
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