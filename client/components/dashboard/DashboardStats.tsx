import StatCard from "./StatCard";

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Outstanding Amount"
        value="₹2,35,600"
      />

      <StatCard
        title="Customers with Credit"
        value="185"
      />

      <StatCard
        title="Unpaid Bills"
        value="94"
      />

      <StatCard
        title="Today's Collection"
        value="₹18,500"
      />
    </div>
  );
}