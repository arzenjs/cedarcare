import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/access";
import { getAppointmentById } from "@/services/staffAppointments";
import { getDoctor } from "@/data/doctors";
import { getService } from "@/data/services";
import { formatDate, formatTime } from "@/lib/scheduling";
import StaffShell from "@/components/dashboard/StaffShell";
import StatusBadge from "@/components/dashboard/StatusBadge";
import AppointmentActions from "@/components/dashboard/AppointmentActions";

export const metadata = { title: "Appointment" };
export const dynamic = "force-dynamic";

const stamp = (d) => (d ? `${formatDate(d)}, ${formatTime(d)}` : null);

export default async function AppointmentDetailPage({ params }) {
  const user = await requireUser("staff");
  const a = await getAppointmentById((await params).appointmentId);
  if (!a) notFound();

  const rows = [
    ["Reference", a.reference],
    ["Patient", a.patientName],
    ["Phone", a.patientPhone],
    ["Email", a.patientEmail],
    ["Doctor", getDoctor(a.doctorId)?.name],
    ["Service", getService(a.service)?.title],
    ["Date", formatDate(a.startsAt)],
    ["Time", `${formatTime(a.startsAt)} to ${formatTime(a.endsAt)} (IST)`],
    ["Patient note", a.note || "None"],
    ["Booked", stamp(a.createdAt)],
    ["Checked in", stamp(a.checkedInAt)],
    ["Completed", stamp(a.completedAt)],
    ["Cancelled", stamp(a.cancelledAt)],
    ["Marked no-show", stamp(a.noShowAt)],
    ["Last changed by", a.statusUpdatedBy?.name],
    ["Confirmation email", `${a.emailStatus?.state}${a.emailStatus?.attempts ? ` (${a.emailStatus.attempts} attempt${a.emailStatus.attempts > 1 ? "s" : ""})` : ""}`],
  ].filter(([, v]) => v);

  return (
    <StaffShell user={user} title="Appointment">
      <Link href="/staff/appointments" className="text-sm font-semibold text-cedar underline underline-offset-4">Back to appointments</Link>
      <div className="mt-4 flex items-center gap-3"><StatusBadge status={a.status} /></div>

      <dl className="mt-6 divide-y divide-line rounded-lg border border-line bg-white">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[11rem_1fr]">
            <dt className="text-sm font-semibold text-muted">{k}</dt>
            <dd className="whitespace-pre-wrap break-words">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <h2 className="mb-3 text-xl text-cedar-dark">Actions</h2>
        <AppointmentActions appointmentId={a._id} status={a.status} canNoShow={new Date(a.startsAt) <= new Date()} />
      </div>
    </StaffShell>
  );
}
