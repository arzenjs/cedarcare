"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { timeLabel } from "@/lib/format";
import DatePicker from "./DatePicker";

const empty = { time: "", date: "" };

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export default function BookingForm({ doctors, services, initialDoctor = "", initialService = "" }) {
  const router = useRouter();
  const [form, setForm] = useState({
    doctorId: initialDoctor, service: initialService, ...empty,
    patientName: "", patientPhone: "", patientEmail: "", note: "", consent: false,
  });
  // Loaded data remembers which doctor/date it belongs to, so "loading" is derived (no flags to keep in sync).
  const [datesData, setDatesData] = useState(null); // { doctorId, dates, error }
  const [slotsData, setSlotsData] = useState(null); // { key, times, error }
  const [refresh, setRefresh] = useState(0);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const doctor = doctors.find((d) => d.id === form.doctorId);
  const doctorServices = doctor ? services.filter((s) => doctor.services.includes(s.id)) : [];
  const slotKey = `${form.doctorId}|${form.date}`;
  const loadingDates = !!form.doctorId && datesData?.doctorId !== form.doctorId;
  const loadingSlots = !!form.date && slotsData?.key !== slotKey;

  // Open dates for the selected doctor.
  useEffect(() => {
    if (!form.doctorId) return;
    let cancelled = false;
    fetch(`/api/availability?doctorId=${form.doctorId}`)
      .then((r) => r.json())
      .then((d) => !cancelled && setDatesData({ doctorId: form.doctorId, dates: d.dates || [], error: !d.ok }))
      .catch(() => !cancelled && setDatesData({ doctorId: form.doctorId, dates: [], error: true }));
    return () => { cancelled = true; };
  }, [form.doctorId]);

  // Free times for the selected doctor and date.
  useEffect(() => {
    if (!form.doctorId || !form.date) return;
    let cancelled = false;
    const key = `${form.doctorId}|${form.date}`;
    fetch(`/api/availability?doctorId=${form.doctorId}&date=${form.date}`)
      .then((r) => r.json())
      .then((d) => !cancelled && setSlotsData({ key, times: d.times || [], error: !d.ok }))
      .catch(() => !cancelled && setSlotsData({ key, times: [], error: true }));
    return () => { cancelled = true; };
  }, [form.doctorId, form.date, refresh]);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const chooseDoctor = (id) => {
    const next = doctors.find((d) => d.id === id);
    // Keep the service only if the new doctor offers it; always clear date and time.
    setForm((f) => ({ ...f, doctorId: id, date: "", time: "", service: next?.services.includes(f.service) ? f.service : "" }));
    setErrors((e) => ({ ...e, doctorId: undefined }));
  };

  const chooseDate = (date) => {
    setForm((f) => ({ ...f, date, time: "" }));
    setErrors((e) => ({ ...e, date: undefined, time: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 201 && data.confirmationToken) {
        router.push(`/appointments/confirmation?token=${encodeURIComponent(data.confirmationToken)}`);
        return; // keep the button disabled while navigating
      }
      if (res.status === 400 && data.errors) setErrors(data.errors);
      if (res.status === 409) {
        // Someone else took the slot: clear the choice and reload times, keep everything else.
        setForm((f) => ({ ...f, time: "" }));
        setSlotsData(null);
        setRefresh((n) => n + 1);
      }
      setFormError(data.error || (data.errors ? "Please fix the highlighted fields." : "Something went wrong. Please try again."));
    } catch {
      setFormError("We could not reach the server. Check your connection and try again.");
    }
    setSubmitting(false);
  }

  const invalid = (name) => ({ "aria-invalid": errors[name] ? true : undefined, "aria-describedby": errors[name] ? `${name}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate className="min-w-0 space-y-10">
      {/* Step 1 */}
      <fieldset className="min-w-0 space-y-5">
        <legend className="font-display text-2xl text-cedar-dark">1. Doctor and service</legend>
        <Field id="doctorId" label="Doctor" error={errors.doctorId}>
          <select id="doctorId" className="field-input" value={form.doctorId} onChange={(e) => chooseDoctor(e.target.value)} {...invalid("doctorId")}>
            <option value="">Select a doctor</option>
            {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}, {d.specialty}</option>)}
          </select>
        </Field>
        <Field id="service" label="Service" error={errors.service}>
          <select id="service" className="field-input" value={form.service} disabled={!doctor} onChange={(e) => set("service", e.target.value)} {...invalid("service")}>
            <option value="">{doctor ? "Select a service" : "Choose a doctor first"}</option>
            {doctorServices.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </Field>
      </fieldset>

      {/* Step 2 */}
      <fieldset className="min-w-0 space-y-5">
        <legend className="font-display text-2xl text-cedar-dark">2. Date and time</legend>

        {!doctor && <p className="text-muted">Choose a doctor to see available dates.</p>}
        {doctor && loadingDates && <p className="text-muted" role="status">Loading dates…</p>}
        {datesData?.error && datesData.doctorId === form.doctorId && <p className="field-error" role="alert">Could not load dates. Please refresh the page.</p>}

        {doctor && !loadingDates && datesData?.dates?.length > 0 && (
          <div className="min-w-0">
            <DatePicker dates={datesData.dates} value={form.date} onChange={chooseDate} />
            {errors.date && <p className="field-error" role="alert">{errors.date}</p>}
          </div>
        )}

        {form.date && (
          <div>
            <p className="field-label" id="time-label">Time ({doctor?.slotMinutes}-minute visit)</p>
            {loadingSlots && <p className="text-muted" role="status">Checking available times…</p>}
            {!loadingSlots && slotsData?.error && <p className="field-error" role="alert">Could not load times. Please try again.</p>}
            {!loadingSlots && !slotsData?.error && slotsData?.times.length === 0 && (
              <p className="rounded-lg border border-line bg-white p-4 text-muted" role="status">No times are free on this date. Please choose another date from the calendar above.</p>
            )}
            {!loadingSlots && slotsData?.times.length > 0 && (
              <div role="group" aria-labelledby="time-label" className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2">
                {slotsData.times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={form.time === t}
                    onClick={() => set("time", t)}
                    className={`min-w-0 truncate rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors ${form.time === t ? "border-cedar bg-cedar text-white" : "border-line bg-white hover:border-leaf"}`}
                  >
                    {timeLabel(t)}
                  </button>
                ))}
              </div>
            )}
            {errors.time && <p className="field-error" role="alert">{errors.time}</p>}
            <button type="button" onClick={() => { setSlotsData(null); setRefresh((n) => n + 1); }} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cedar underline underline-offset-4">
              <RefreshCw size={14} aria-hidden="true" />Refresh times
            </button>
          </div>
        )}
      </fieldset>

      {/* Step 3 */}
      <fieldset className="min-w-0 space-y-5">
        <legend className="font-display text-2xl text-cedar-dark">3. Your details</legend>
        <Field id="patientName" label="Full name" error={errors.patientName}>
          <input id="patientName" className="field-input" autoComplete="name" value={form.patientName} onChange={(e) => set("patientName", e.target.value)} {...invalid("patientName")} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="patientPhone" label="Phone number" error={errors.patientPhone}>
            <input id="patientPhone" type="tel" inputMode="tel" className="field-input" autoComplete="tel" placeholder="+91 98765 43210" value={form.patientPhone} onChange={(e) => set("patientPhone", e.target.value)} {...invalid("patientPhone")} />
          </Field>
          <Field id="patientEmail" label="Email address" error={errors.patientEmail}>
            <input id="patientEmail" type="email" className="field-input" autoComplete="email" value={form.patientEmail} onChange={(e) => set("patientEmail", e.target.value)} {...invalid("patientEmail")} />
          </Field>
        </div>
        <Field id="note" label={`Note for the clinic (optional, ${form.note.length}/300)`} error={errors.note}>
          <textarea id="note" rows={3} maxLength={300} className="field-input" value={form.note} onChange={(e) => set("note", e.target.value)} {...invalid("note")} />
        </Field>
        <p className="text-sm text-muted">Please do not include detailed medical history here.</p>

        <div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-[#1e4b41]" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} {...invalid("consent")} />
            <span>I have read the <a href="/privacy" target="_blank" className="font-semibold text-cedar underline">privacy notice</a> and agree to my details being used to manage this appointment.</span>
          </label>
          {errors.consent && <p id="consent-error" className="field-error" role="alert">{errors.consent}</p>}
        </div>
      </fieldset>

      {formError && <p className="rounded-lg border border-danger/40 bg-danger/5 p-4 text-danger" role="alert">{formError}</p>}

      <button type="submit" className="btn btn-primary w-full !py-3.5 sm:w-auto sm:!px-10" disabled={submitting}>
        {submitting ? "Booking…" : "Confirm appointment"}
      </button>
    </form>
  );
}
