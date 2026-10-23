import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { clinic, telHref } from "@/config/clinic";
import { getDoctor } from "@/data/doctors";
import { getService } from "@/data/services";
import { formatDate, formatTime } from "@/lib/scheduling";
import { findByConfirmationToken } from "@/services/appointments";

export const metadata = { title: "Appointment confirmation", robots: { index: false, follow: false } };

const statusLabel = { scheduled: "Scheduled", checked_in: "Checked in", completed: "Completed", cancelled: "Cancelled", no_show: "Missed" };
const emailLabel = {
  sent: "A confirmation email has been sent to you.",
  pending: "Your confirmation email is being prepared.",
  failed: "We could not send your confirmation email, but your appointment is saved. Keep this page or note your reference.",
  skipped: "Email confirmation is not enabled on this demo. Please note your reference.",
};

export default async function ConfirmationPage({ searchParams }) {
  // Access requires the long random token from the booking response. The reference or
  // database id alone cannot open this page, so appointments cannot be found by guessing.
  const { token } = await searchParams;
  const appt = await findByConfirmationToken(token);
  if (!appt) notFound();

  const doctor = getDoctor(appt.doctorId);
  const service = getService(appt.service);
  const rows = [
    ["Reference", appt.reference],
    ["Patient", appt.patientName],
    ["Doctor", `${doctor?.name ?? ""}, ${doctor?.specialty ?? ""}`],
    ["Service", service?.title ?? ""],
    ["Date", formatDate(appt.startsAt)],
    ["Time", `${formatTime(appt.startsAt)} (India Standard Time)`],
    ["Type", "In-person clinic appointment"],
    ["Status", statusLabel[appt.status]],
  ];

  return (
    <div className="page-width max-w-3xl py-16">
      <div className="flex items-center gap-3 text-cedar">
        <CheckCircle2 size={36} aria-hidden="true" />
        <h1 className="text-4xl text-cedar-dark">Your appointment is confirmed</h1>
      </div>
      <p className="mt-3 text-muted">{emailLabel[appt.emailStatus?.state] || ""}</p>

      <dl className="mt-8 divide-y divide-line rounded-lg border border-line bg-white">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm font-semibold text-muted">{k}</dt>
            <dd className={k === "Reference" ? "font-mono text-lg font-semibold" : ""}>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 rounded-lg bg-mist p-6">
        <h2 className="text-xl text-cedar-dark">Need to change something?</h2>
        <p className="mt-2 text-muted">Call <a className="font-semibold text-cedar underline" href={telHref}>{clinic.phone}</a> and quote your reference. Please arrive 10 minutes early.</p>
        <p className="mt-2 text-sm text-muted">{clinic.name}, {clinic.address}</p>
      </div>
      <Link href="/" className="btn btn-secondary mt-8">Back to home</Link>
    </div>
  );
}
