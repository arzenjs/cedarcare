import { Resend } from "resend";
import { clinic, siteUrl } from "@/config/clinic";
import { escapeHtml } from "@/lib/security";
import { formatDate, formatTime } from "@/lib/scheduling";
import { getDoctor } from "@/data/doctors";
import { getService } from "@/data/services";

// Every sender returns { ok: true } or { ok: false, error, skipped? } and never throws,
// so a failed email can never break a booking that was already saved.

async function send({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || apiKey.includes("replace_me")) {
    return { ok: false, skipped: true, error: "Email is not configured (RESEND_API_KEY / RESEND_FROM_EMAIL)." };
  }
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) return { ok: false, error: String(error.message || "Provider rejected the email").slice(0, 200) };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err.message || "Email request failed").slice(0, 200) };
  }
}

const wrap = (body) => `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#13211d;line-height:1.55">
  <h1 style="font-size:20px;color:#1e4b41;margin:0 0 16px">${escapeHtml(clinic.name)}</h1>
  ${body}
  <hr style="border:none;border-top:1px solid #d8dfda;margin:24px 0">
  <p style="font-size:13px;color:#55645f">${escapeHtml(clinic.address)}<br>${escapeHtml(clinic.phone)} · ${escapeHtml(clinic.email)}</p>
</div>`;

export function sendAppointmentConfirmation(appt) {
  const doctor = getDoctor(appt.doctorId);
  const service = getService(appt.service);
  return send({
    to: appt.patientEmail,
    subject: `Appointment confirmed – ${appt.reference}`,
    html: wrap(`
      <p>Hello ${escapeHtml(appt.patientName)},</p>
      <p>Your appointment is confirmed.</p>
      <table style="border-collapse:collapse;font-size:15px">
        <tr><td style="padding:4px 16px 4px 0;color:#55645f">Reference</td><td><strong>${escapeHtml(appt.reference)}</strong></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#55645f">Doctor</td><td>${escapeHtml(doctor?.name || "")}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#55645f">Service</td><td>${escapeHtml(service?.title || "")}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#55645f">Date</td><td>${escapeHtml(formatDate(appt.startsAt))}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#55645f">Time</td><td>${escapeHtml(formatTime(appt.startsAt))} (India Standard Time)</td></tr>
      </table>
      <p>Please arrive 10 minutes early and bring any recent reports. To change or cancel, call us and quote your reference.</p>`),
  });
}

export function sendContactNotification({ name, email, message }) {
  return send({
    to: process.env.CONTACT_TO_EMAIL || clinic.email,
    subject: `Website enquiry from ${name}`,
    html: wrap(`<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) wrote:</p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>`),
  });
}

export function sendInvitationEmail({ to, role, token, invitedByName, hours }) {
  const link = `${siteUrl}/staff/invite?token=${encodeURIComponent(token)}`;
  return send({
    to,
    subject: `You're invited to the ${clinic.name} staff portal`,
    html: wrap(`
      <p>${escapeHtml(invitedByName)} has invited you to join the staff portal as <strong>${escapeHtml(role)}</strong>.</p>
      <p><a href="${escapeHtml(link)}" style="display:inline-block;background:#1e4b41;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Set up your account</a></p>
      <p style="font-size:14px;color:#55645f">This link works once and expires in ${hours} hours. If you were not expecting it, ignore this email. No password is sent by email.</p>`),
  });
}
