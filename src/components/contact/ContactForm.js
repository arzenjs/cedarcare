"use client";
import { useState } from "react";

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [message, setMessage] = useState("");

  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("sent");
        setValues({ name: "", email: "", message: "", website: "" });
        return;
      }
      if (data.errors) setErrors(data.errors);
      setMessage(data.error || "Please fix the highlighted fields.");
    } catch {
      setMessage("We could not reach the server. Please try again.");
    }
    setStatus("error");
  }

  if (status === "sent") {
    return <p role="status" className="rounded-lg bg-mist p-6 text-cedar-dark">Thank you. Your message has been sent and we will reply soon.</p>;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Honeypot field for bots; hidden from people and assistive tech. */}
      <div className="hidden" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={change} /></label>
      </div>
      {[
        ["name", "Your name", "text", "name"],
        ["email", "Email address", "email", "email"],
      ].map(([name, label, type, auto]) => (
        <div key={name}>
          <label htmlFor={name} className="field-label">{label}</label>
          <input id={name} name={name} type={type} autoComplete={auto} className="field-input" value={values[name]} onChange={change} aria-invalid={errors[name] ? true : undefined} aria-describedby={errors[name] ? `${name}-error` : undefined} />
          {errors[name] && <p id={`${name}-error`} className="field-error" role="alert">{errors[name]}</p>}
        </div>
      ))}
      <div>
        <label htmlFor="message" className="field-label">Message</label>
        <textarea id="message" name="message" rows={5} className="field-input" value={values.message} onChange={change} aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? "message-error" : undefined} />
        {errors.message && <p id="message-error" className="field-error" role="alert">{errors.message}</p>}
        <p className="mt-1 text-xs text-muted">Please do not share medical details here. To book, use the appointment form.</p>
      </div>
      {status === "error" && <p className="field-error" role="alert">{message}</p>}
      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send message"}</button>
    </form>
  );
}
