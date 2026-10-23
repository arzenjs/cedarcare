import Link from "next/link";
import { requireUser } from "@/lib/access";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import { dashboardCounts } from "@/services/staffAppointments";
import StaffShell from "@/components/dashboard/StaffShell";
import { RetryEmail } from "@/components/dashboard/AdminStaffPanel";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireUser("admin");
  await connectDB();
  const [counts, staffCount, failed] = await Promise.all([
    dashboardCounts(),
    User.countDocuments({ isActive: true }),
    Appointment.find({ "emailStatus.state": { $in: ["failed", "skipped"] } }).sort({ createdAt: -1 }).limit(20).select("reference patientName emailStatus").lean(),
  ]);

  return (
    <StaffShell user={user} title="Admin overview">
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["Appointments today", counts.today], ["Upcoming", counts.upcoming], ["Checked in", counts.checkedIn], ["Active staff accounts", staffCount]].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-line bg-white p-4"><dt className="text-sm text-muted">{l}</dt><dd className="mt-1 font-display text-4xl text-cedar-dark">{v}</dd></div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/staff" className="btn btn-primary">Manage staff</Link>
        <Link href="/staff/appointments" className="btn btn-secondary">View appointments</Link>
      </div>

      <h2 className="mt-12 text-2xl text-cedar-dark">Confirmation emails not delivered</h2>
      {failed.length === 0 ? (
        <p className="mt-3 text-muted">None. Every saved booking has a delivered confirmation email.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-white">
          {failed.map((a) => (
            <li key={String(a._id)} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <span><span className="font-mono">{a.reference}</span> · {a.patientName} · <span className="text-muted">{a.emailStatus.state}{a.emailStatus.lastError ? `: ${a.emailStatus.lastError}` : ""}</span></span>
              <RetryEmail appointmentId={String(a._id)} />
            </li>
          ))}
        </ul>
      )}
    </StaffShell>
  );
}
