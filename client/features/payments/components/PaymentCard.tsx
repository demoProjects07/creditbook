import { Payment } from "../types/payment";

type Props = {
  payment: Payment;
};

export default function PaymentCard({
  payment,
}: Props) {
  return (
    <div className="rounded-lg border bg-green-50 p-4">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">
            ₹{payment.amount.toLocaleString()}
          </p>

          <p className="text-sm text-gray-600">
            {payment.note || "Payment"}
          </p>
        </div>

        <p className="text-sm text-gray-500">
          {new Date(payment.paymentDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}