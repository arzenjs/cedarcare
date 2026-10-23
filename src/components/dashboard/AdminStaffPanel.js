"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

async function call(url, options, router) {
  const res = await fetch(url, options);
  if (res.status === 401) { router.push("/staff/login?expired=1"); return null; }
  return { ok: res.ok, data: await res.json().catch(() => ({})) };
}

export function InviteForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const r = await call("/api/admin/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, role }) }, router);
    setBusy(false);
    if (!r) return;
    setMsg({ type: r.ok && r.data.emailSent ? "ok" : "error", text: r.data.message || r.data.error });
    if (r.ok) { setEmail(""); router.refresh(); }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
      <div>
        <label htmlFor="invite-email" className="field-label">Email to invite</label>
        <input id="invite-email" type="email" required className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="invite-role" className="field-label">Role</label>
        <select id="invite-role" className="field-input" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button className="btn btn-primary" disabled={busy}>{busy ? "Sending…" : "Send invitation"}</button>
      <p role="status" className={`text-sm sm:col-span-3 ${msg.type === "error" ? "text-danger" : "text-cedar"}`}>{msg.text}</p>
    </form>
  );
}

export function ToggleActive({ userId, isActive, disabled }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function toggle() {
    if (isActive && !window.confirm("Deactivate this account? They will lose access immediately.")) return;
    setBusy(true);
    const r = await call(`/api/admin/staff/${userId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) }, router);
    setBusy(false);
    if (r?.ok) router.refresh(); else if (r) setErr(r.data.error || "Failed");
  }
  return (
    <span>
      <button type="button" onClick={toggle} disabled={busy || disabled} className="font-semibold text-cedar underline underline-offset-4 disabled:text-muted disabled:no-underline">{isActive ? "Deactivate" : "Activate"}</button>
      {err && <span role="alert" className="ml-2 text-sm text-danger">{err}</span>}
    </span>
  );
}

export function RevokeInvite({ invitationId }) {
  const router = useRouter();
  async function revoke() {
    const r = await call(`/api/admin/invitations/${invitationId}`, { method: "DELETE" }, router);
    if (r?.ok) router.refresh();
  }
  return <button type="button" onClick={revoke} className="font-semibold text-danger underline underline-offset-4">Revoke</button>;
}

export function RetryEmail({ appointmentId }) {
  const router = useRouter();
  const [state, setState] = useState("");
  async function retry() {
    setState("Sending…");
    const r = await call(`/api/admin/appointments/${appointmentId}/email`, { method: "POST" }, router);
    if (!r) return;
    setState(r.ok ? "Sent" : r.data.error || "Failed");
    if (r.ok) router.refresh();
  }
  return (
    <span>
      <button type="button" onClick={retry} className="font-semibold text-cedar underline underline-offset-4">Retry email</button>
      <span role="status" className="ml-2 text-sm text-muted">{state}</span>
    </span>
  );
}
