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
  const attachmentUrl = bill.attachment
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${bill.attachment}`
    : null;

  const isImage =
    bill.attachment &&
    /\.(jpg|jpeg|png|gif|webp)$/i.test(bill.attachment);

  const isPdf =
    bill.attachment &&
    /\.pdf$/i.test(bill.attachment);

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">

        <div className="space-y-2">

          <p className="text-sm text-gray-500">
            Bill Amount
          </p>

          <p className="text-2xl font-bold">
            ₹{bill.amount.toLocaleString()}
          </p>
          <p className="text-green-600">
            Paid:
            <span className="font-semibold">
              {" "}
              ₹{bill.paidAmount.toLocaleString()}
            </span>
          </p>

          <p className="text-red-600">
            Remaining:
            <span className="font-semibold">
              {" "}
              ₹{(bill.amount - bill.paidAmount).toLocaleString()}
            </span>
          </p>

          <div>
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                bill.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : bill.status === "PARTIAL"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {bill.status === "PAID"
                ? "🟢 PAID"
                : bill.status === "PARTIAL"
                ? "🟡 PARTIAL"
                : "🔴 UNPAID"}
            </span>
          </div>

          <p className="text-gray-600">
            {bill.note || "No note"}
          </p>

          <p className="text-sm text-gray-500">
            {new Date(bill.billDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>

          {attachmentUrl && (
            <div className="rounded-lg border bg-gray-50 p-3">

              <p className="font-medium">
                📎 Attachment
              </p>

              <p className="mt-1 break-all text-sm text-gray-600">
                {bill.attachmentOriginal || bill.attachment}
              </p>

              {isImage && (
                <>
                  <img
                    src={attachmentUrl}
                    alt="Bill"
                    className="mt-2 h-40 rounded border object-cover"
                  />

                  <div className="mt-2 flex gap-4">
                    <a
                      href={attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      👁 View Full Image
                    </a>

                    <a
                      href={attachmentUrl}
                      download={bill.attachment || "bill"}
                      className="text-green-600 hover:underline"
                    >
                      ⬇ Download
                    </a>
                  </div>
                </>
              )}

              {isPdf && (
                <div className="mt-2 flex gap-4">
                  <a
                    href={attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    📄 Open PDF
                  </a>

                  <a
                    href={attachmentUrl}
                    download={bill.attachment || "bill.pdf"}
                    className="text-green-600 hover:underline"
                  >
                    ⬇ Download
                  </a>
                </div>
              )}

            </div>
          )}
          {bill.payments?.length > 0 && (
            <div className="mt-4 rounded-lg border bg-green-50 p-3">
              <h4 className="mb-2 font-semibold text-green-700">
                Payment History
              </h4>

              <div className="space-y-2">
                {bill.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded bg-white p-3 shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-green-700">
                        +₹{payment.amount.toLocaleString()}
                      </p>

                      <p className="text-xs text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>

                      {payment.note && (
                        <p className="text-sm text-gray-600">
                          {payment.note}
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      Payment
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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