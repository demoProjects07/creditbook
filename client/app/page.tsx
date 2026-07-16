import AppLayout from "@/components/layout/AppLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to CreditBook
          </h2>

          <p className="mt-2 text-gray-600">
            Manage your customers, bills, and payments in one place.
          </p>
        </div>

        <DashboardStats />
      </div>
    </AppLayout>
  );
}