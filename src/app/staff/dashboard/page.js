import Link from "next/link";
import { requireUser } from "@/lib/access";
import { dashboardCounts, todaysAppointments } from "@/services/staffAppointments";
import StaffShell from "@/components/dashboard/StaffShell";
import AppointmentTable from "@/components/dashboard/AppointmentTable";

export const metadata = { title: "Staff dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser("staff");
  const [counts, today] = await Promise.all([dashboardCounts(), todaysAppointments()]);

  const stats = [
    ["Today", counts.today, "Not cancelled"],
    ["Upcoming", counts.upcoming, "Scheduled from now"],
    ["Checked in", counts.checkedIn, "Waiting to be seen"],
    ["Completed today", counts.completedToday, ""],
    ["Cancelled today", counts.cancelledToday, ""],
  ];

  return (
    <StaffShell user={user} title="Dashboard">
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map(([label, value, hint]) => (
          <div key={label} className="rounded-lg border border-line bg-white p-4">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="mt-1 font-display text-4xl text-cedar-dark">{value}</dd>
            {hint && <p className="text-xs text-muted">{hint}</p>}
          </div>
        ))}
      </dl>

      <div className="mt-10 flex items-end justify-between">
        <h2 className="text-2xl text-cedar-dark">Today&apos;s appointments</h2>
        <Link href="/staff/appointments" className="text-sm font-semibold text-cedar underline underline-offset-4">All appointments</Link>
      </div>
      <div className="mt-4">
        {today.length === 0
          ? <p className="rounded-lg border border-line bg-white p-6 text-muted">No appointments today.</p>
          : <AppointmentTable items={today} />}
      </div>
    </StaffShell>
  );
}
