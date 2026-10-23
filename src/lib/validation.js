// Server-side input validation. Each function returns { value } or { errors }.
// Never trust the browser: every public API runs its input through here.

import { getDoctor } from "../data/doctors.js";
import { getService } from "../data/services.js";
import { isValidDateString } from "./scheduling.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s-]{8,14}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const clean = (v) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");

export function validateBooking(input) {
  const errors = {};
  const body = input && typeof input === "object" ? input : {};

  const doctorId = clean(body.doctorId);
  const doctor = getDoctor(doctorId);
  if (!doctor) errors.doctorId = "Please choose a doctor.";

  const serviceId = clean(body.service);
  if (!getService(serviceId) || (doctor && !doctor.services.includes(serviceId))) {
    errors.service = "Please choose a service offered by this doctor.";
  }

  const date = clean(body.date);
  if (!isValidDateString(date)) errors.date = "Please choose a date.";

  const time = clean(body.time);
  if (!TIME_RE.test(time)) errors.time = "Please choose a time.";

  const patientName = clean(body.patientName);
  if (patientName.length < 2 || patientName.length > 80) errors.patientName = "Enter your full name (2–80 characters).";

  const patientEmail = clean(body.patientEmail).toLowerCase();
  if (!EMAIL_RE.test(patientEmail) || patientEmail.length > 120) errors.patientEmail = "Enter a valid email address.";

  const patientPhone = clean(body.patientPhone);
  if (!PHONE_RE.test(patientPhone)) errors.patientPhone = "Enter a valid phone number (9–15 digits).";

  // Notes keep their line breaks out; we only store a short plain-text note.
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 300) : "";
  if (typeof body.note === "string" && body.note.trim().length > 300) errors.note = "Please keep the note under 300 characters.";

  if (body.consent !== true) errors.consent = "Please accept the privacy notice to continue.";

  if (Object.keys(errors).length) return { errors };
  return { value: { doctor, serviceId, date, time, patientName, patientEmail, patientPhone, note } };
}

export function validateContact(input) {
  const errors = {};
  const body = input && typeof input === "object" ? input : {};
  const name = clean(body.name);
  if (name.length < 2 || name.length > 80) errors.name = "Enter your name.";
  const email = clean(body.email).toLowerCase();
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length < 10 || message.length > 1000) errors.message = "Message must be 10–1000 characters.";
  if (Object.keys(errors).length) return { errors };
  return { value: { name, email, message } };
}
