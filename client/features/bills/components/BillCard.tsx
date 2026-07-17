import { Bill } from "../types/bill";

type Props = {
  bill: Bill;
};

export default function BillCard({ bill }: Props) {
  return (
    <div className="rounded-lg border p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">
            ₹{bill.amount.toLocaleString()}
          </p>

          <p className="text-gray-600">
            {bill.note || "No note"}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {new Date(bill.billDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}