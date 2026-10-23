import Link from "next/link";
import { requireUser } from "@/lib/access";
import { doctors } from "@/data/doctors";
import { searchAppointments } from "@/services/staffAppointments";
import StaffShell from "@/components/dashboard/StaffShell";
import AppointmentTable from "@/components/dashboard/AppointmentTable";

export const metadata = { title: "Appointments" };
export const dynamic = "force-dynamic";

const STATUS_OPTIONS = [["", "Any status"], ["scheduled", "Scheduled"], ["checked_in", "Checked in"], ["completed", "Completed"], ["cancelled", "Cancelled"], ["no_show", "No-show"]];

export default async function AppointmentsListPage({ searchParams }) {
  const user = await requireUser("staff");
  const sp = await searchParams;
  const one = (v) => (typeof v === "string" ? v : "");
  const filters = { q: one(sp.q), date: one(sp.date), doctor: one(sp.doctor), status: one(sp.status), page: one(sp.page) };
  const { items, total, page, pages } = await searchAppointments(filters);

  const pageHref = (p) => {
    const qs = new URLSearchParams(Object.entries({ ...filters, page: p }).filter(([, v]) => v));
    return `/staff/appointments?${qs}`;
  };

  return (
    <StaffShell user={user} title="Appointments">
      {/* Plain GET form: filters live in the URL, so no client JavaScript is needed. */}
      <form method="get" className="grid gap-4 rounded-lg border border-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label htmlFor="q" className="field-label">Search</label>
          <input id="q" name="q" defaultValue={filters.q} placeholder="Name, phone or CC-…" className="field-input" />
        </div>
        <div>
          <label htmlFor="date" className="field-label">Date</label>
          <input id="date" name="date" type="date" defaultValue={filters.date} className="field-input" />
        </div>
        <div>
          <label htmlFor="doctor" className="field-label">Doctor</label>
          <select id="doctor" name="doctor" defaultValue={filters.doctor} className="field-input">
            <option value="">All doctors</option>
            {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="field-label">Status</label>
          <select id="status" name="status" defaultValue={filters.status} className="field-input">
            {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary">Apply</button>
          <Link href="/staff/appointments" className="btn btn-secondary">Reset</Link>
        </div>
      </form>

      <p className="mt-6 text-sm text-muted">{total} appointment{total === 1 ? "" : "s"}{Object.values({ ...filters, page: "" }).some(Boolean) ? " match your filters" : " from today onwards"}</p>
      <div className="mt-3">
        {items.length === 0
          ? <p className="rounded-lg border border-line bg-white p-8 text-center text-muted">No appointments found. Try changing or resetting the filters.</p>
          : <AppointmentTable items={items} />}
      </div>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          {page > 1 ? <Link className="btn btn-secondary !py-1.5" href={pageHref(page - 1)}>Previous</Link> : <span />}
          <span className="text-muted">Page {page} of {pages}</span>
          {page < pages ? <Link className="btn btn-secondary !py-1.5" href={pageHref(page + 1)}>Next</Link> : <span />}
        </nav>
      )}
    </StaffShell>
  );
}
