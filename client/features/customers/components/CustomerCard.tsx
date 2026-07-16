import { Customer } from "../types/customer";

type CustomerCardProps = {
  customer: Customer;
};

export default function CustomerCard({
  customer,
}: CustomerCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">
            👤 {customer.name}
          </h3>

          {customer.mobile && (
            <p className="mt-1 text-gray-600">
              📞 {customer.mobile}
            </p>
          )}
        </div>

        <span className="text-sm text-gray-500">
          {customer.id}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Outstanding
          </p>

          <p className="text-2xl font-bold text-red-600">
            ₹{customer.outstanding.toLocaleString()}
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          View Details →
        </button>
      </div>
    </div>
  );
}