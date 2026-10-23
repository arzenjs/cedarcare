"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TRANSITIONS } from "@/lib/statusTransitions";

const LABEL = { checked_in: "Mark checked in", completed: "Mark completed", no_show: "Mark no-show", cancelled: "Cancel appointment" };
const CONFIRM = {
  cancelled: "Cancel this appointment? The time slot becomes available to other patients.",
  no_show: "Mark this patient as a no-show? This cannot be undone.",
};

export default function AppointmentActions({ appointmentId, status, canNoShow }) {
  const router = useRouter();
  const dialogRef = useRef(null);
  const [pending, setPending] = useState(null); // status awaiting confirmation
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const options = (TRANSITIONS[status] || []).filter((s) => s !== "no_show" || canNoShow);

  async function apply(next) {
    setBusy(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch(`/api/staff/appointments/${appointmentId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
      if (res.status === 401) { router.push("/staff/login?expired=1"); return; } // session expired
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setMessage({ type: "ok", text: "Appointment updated." }); router.refresh(); }
      else setMessage({ type: "error", text: data.error || "Could not update the appointment." });
    } catch {
      setMessage({ type: "error", text: "Network problem. Please try again." });
    }
    setBusy(false);
  }

  function choose(next) {
    if (CONFIRM[next]) { setPending(next); dialogRef.current?.showModal(); }
    else apply(next);
  }

  if (options.length === 0) return <p className="text-sm text-muted">No further actions: this appointment is {status.replace("_", " ")}.</p>;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {options.map((s) => (
          <button key={s} type="button" disabled={busy} onClick={() => choose(s)} className={`btn ${s === "cancelled" ? "btn-secondary !border-danger !text-danger" : "btn-primary"}`}>{LABEL[s]}</button>
        ))}
      </div>
      <p role="status" className={`mt-3 text-sm ${message.type === "error" ? "text-danger" : "text-cedar"}`}>{message.text}</p>

      {/* Native <dialog>: focus is trapped and Escape closes it. */}
      <dialog ref={dialogRef} className="m-auto w-[min(92vw,26rem)] rounded-lg p-6 backdrop:bg-black/40" aria-labelledby="confirm-title">
        <h2 id="confirm-title" className="text-xl text-cedar-dark">Please confirm</h2>
        <p className="mt-2 text-muted">{CONFIRM[pending]}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn btn-secondary" onClick={() => dialogRef.current?.close()}>Keep it</button>
          <button type="button" className="btn btn-danger" onClick={() => { dialogRef.current?.close(); apply(pending); }}>Yes, continue</button>
        </div>
      </dialog>
    </div>
  );
}
