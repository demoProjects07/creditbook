import { Customer } from "../types/customer";
import Link from "next/link";

type CustomerCardProps = {
  customer: Customer;
};

export default function CustomerCard({
  customer,
}: CustomerCardProps) {
  return (
    <Link href={`/customers/${customer.id}`}>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4">
              {customer.photo ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${customer.photo}`}
                  alt={customer.name}
                  className="h-14 w-14 rounded-full object-cover border"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-xl">
                  👤
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold">
                  {customer.name}
                </h3>

                {customer.mobile && (
                  <p className="mt-1 text-gray-600">
                    📞 {customer.mobile}
                  </p>
                )}

                <p className="mt-1 text-sm text-gray-500">
                  Code: {customer.customerCode}
                </p>
              </div>
            </div>
          </div>

          <span className="text-sm text-gray-500">
            {customer.id.slice(0, 8)}
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
    </Link>
  );
}