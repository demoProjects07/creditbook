import AppLayout from "@/components/layout/AppLayout";
import { getCustomer } from "@/services/customer.service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const customer = await getCustomer(id);

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
            {" "}
            <span className="font-semibold">
              {customer.customerCode}
            </span>
          </p>

        </div>

      </div>
    </AppLayout>
  );
}