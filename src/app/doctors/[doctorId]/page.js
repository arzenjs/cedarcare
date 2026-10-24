import Link from "next/link";
import { notFound } from "next/navigation";
import { doctors, getDoctor } from "@/data/doctors";
import { getService } from "@/data/services";
import { doctorTimetable } from "@/lib/format";
import Image from "next/image";
import BookLink from "@/components/ui/BookLink";

export function generateStaticParams() {
  return doctors.map((d) => ({ doctorId: d.id }));
}

export async function generateMetadata({ params }) {
  const doctor = getDoctor((await params).doctorId);
  return { title: doctor ? doctor.name : "Doctor not found" };
}

export default async function DoctorPage({ params }) {
  const doctor = getDoctor((await params).doctorId);
  if (!doctor) notFound();

  return (
    <div className="page-width py-16">
      <Link href="/doctors" className="text-sm font-semibold text-cedar underline underline-offset-4">All doctors</Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="aspect-[4/5] w-44 shrink-0 overflow-hidden rounded-2xl border border-line bg-mist sm:w-56">
          <Image src={doctor.image} alt={doctor.imageAlt} width={400} height={500} priority sizes="14rem" className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-5xl text-cedar-dark">{doctor.name}</h1>
          <p className="mt-1 text-lg font-medium text-leaf">{doctor.specialty}</p>
          <div className="mt-5"><BookLink doctorId={doctor.id}>Book with {doctor.name.replace("Dr. ", "Dr ")}</BookLink></div>
        </div>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="text-2xl text-cedar-dark">About</h2>
          <p className="mt-3 max-w-prose text-lg leading-relaxed text-muted">{doctor.bio}</p>

          <h2 className="mt-10 text-2xl text-cedar-dark">Qualifications and experience</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
            {doctor.qualifications.map((q) => <li key={q}>{q}</li>)}
            <li>{doctor.experience}</li>
          </ul>
          <p className="mt-3 text-sm text-muted">All qualifications are sample information for this demo.</p>

          <h2 className="mt-10 text-2xl text-cedar-dark">Consultations</h2>
          <ul className="mt-3 space-y-2">
            {doctor.services.map((id) => {
              const s = getService(id);
              return (
                <li key={id}>
                  <BookLink doctorId={doctor.id} serviceId={id} variant="secondary" className="!py-2 !text-sm">{s.title}</BookLink>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="h-fit rounded-lg border border-line bg-white p-6">
          <h2 className="text-2xl text-cedar-dark">Availability</h2>
          <p className="mt-1 text-sm text-muted">{doctor.slotMinutes}-minute consultations</p>
          <table className="mt-4 w-full text-sm">
            <caption className="sr-only">Weekly consultation hours</caption>
            <tbody className="divide-y divide-line">
              {doctorTimetable(doctor).map((r) => (
                <tr key={r.day}>
                  <th scope="row" className="py-2 pr-3 text-left font-semibold">{r.day}</th>
                  <td className="py-2 text-muted">{r.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-muted">Closed Sundays and on clinic holidays. The booking form shows live open times.</p>
        </aside>
      </div>
    </div>
  );
}
