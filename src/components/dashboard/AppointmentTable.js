import Link from "next/link";
import { getDoctor } from "@/data/doctors";
import { getService } from "@/data/services";
import { formatDate, formatTime } from "@/lib/scheduling";
import StatusBadge from "./StatusBadge";

// Table on wide screens, stacked cards on phones.
export default function AppointmentTable({ items }) {
  return (
    <>
      <table className="hidden w-full text-left text-sm md:table">
        <caption className="sr-only">Appointments</caption>
        <thead className="border-b border-line text-muted">
          <tr>{["When", "Patient", "Doctor and service", "Contact", "Status", ""].map((h) => <th key={h} scope="col" className="py-3 pr-4 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((a) => (
            <tr key={a._id}>
              <td className="py-3 pr-4 whitespace-nowrap"><span className="font-semibold">{formatTime(a.startsAt)}</span><br /><span className="text-muted">{formatDate(a.startsAt)}</span></td>
              <td className="py-3 pr-4"><span className="font-semibold">{a.patientName}</span><br /><span className="font-mono text-xs text-muted">{a.reference}</span></td>
              <td className="py-3 pr-4">{getDoctor(a.doctorId)?.name}<br /><span className="text-muted">{getService(a.service)?.title}</span></td>
              <td className="py-3 pr-4"><a className="underline" href={`tel:${a.patientPhone.replace(/\s/g, "")}`}>{a.patientPhone}</a><br /><span className="text-muted">{a.patientEmail}</span></td>
              <td className="py-3 pr-4"><StatusBadge status={a.status} /></td>
              <td className="py-3"><Link className="font-semibold text-cedar underline underline-offset-4" href={`/staff/appointments/${a._id}`}>Open</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="space-y-3 md:hidden">
        {items.map((a) => (
          <li key={a._id} className="rounded-lg border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div><p className="font-semibold">{a.patientName}</p><p className="font-mono text-xs text-muted">{a.reference}</p></div>
              <StatusBadge status={a.status} />
            </div>
            <p className="mt-2 text-sm">{formatDate(a.startsAt)}, {formatTime(a.startsAt)}</p>
            <p className="text-sm text-muted">{getDoctor(a.doctorId)?.name} · {getService(a.service)?.title}</p>
            <Link className="mt-3 inline-block font-semibold text-cedar underline underline-offset-4" href={`/staff/appointments/${a._id}`}>Open</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
