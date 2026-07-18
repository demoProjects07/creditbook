import { Bill } from "../types/bill";
import EditBillDialog from "./EditBillDialog";

type Props = {
  bill: Bill;
  onDelete: (id: string) => void;
  onUpdated: () => void;
};

export default function BillCard({
  bill,
  onDelete,
  onUpdated,
}: Props) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">
            ₹{bill.amount.toLocaleString()}
          </p>

          <p className="text-gray-600">
            {bill.note || "No note"}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {new Date(bill.billDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2">
          <EditBillDialog
            bill={bill}
            onUpdated={onUpdated}
          />

          <button
            onClick={() => onDelete(bill.id)}
            className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}