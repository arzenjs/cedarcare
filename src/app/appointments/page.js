import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import BookingForm from "@/components/appointments/BookingForm";

export const metadata = { title: "Book an appointment" };

export default async function AppointmentsPage({ searchParams }) {
  const params = await searchParams;
  const doctorId = typeof params.doctor === "string" && doctors.some((d) => d.id === params.doctor) ? params.doctor : "";
  const serviceId = typeof params.service === "string" && services.some((s) => s.id === params.service) ? params.service : "";

  // Only pass what the form needs (no schedules) to the browser.
  const doctorOptions = doctors.map(({ id, name, specialty, slotMinutes, services }) => ({ id, name, specialty, slotMinutes, services }));
  const serviceOptions = services.map(({ id, title }) => ({ id, title }));

  return (
    <div className="page-width grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 max-w-2xl">
        <h1 className="text-5xl text-cedar-dark">Book an appointment</h1>
        <p className="mt-4 mb-10 text-lg text-muted">No account needed. Your appointment is confirmed only after it is saved.</p>
        <BookingForm doctors={doctorOptions} services={serviceOptions} initialDoctor={doctorId} initialService={serviceId} />
      </div>
      <aside className="h-fit rounded-lg border border-line bg-white p-6 text-sm lg:sticky lg:top-24">
        <h2 className="text-xl text-cedar-dark">Before you book</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
          <li>Times shown are India Standard Time.</li>
          <li>Bookings need at least 2 hours&apos; notice and open 30 days ahead.</li>
          <li>To change or cancel, call the clinic with your reference.</li>
          <li>For emergencies, go to your nearest hospital.</li>
        </ul>
      </aside>
    </div>
  );
}
