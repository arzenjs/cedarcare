// Pure scheduling logic (no database). Used by the availability API AND re-checked
// at booking time, so the website and the server always agree on what a valid slot is.
//
// Time zone note: Asia/Kolkata is UTC+05:30 all year (no daylight saving), so a local
// clinic time can be converted to an exact instant by appending "+05:30".

import { clinic, scheduling } from "../config/clinic.js";

const IST_OFFSET = "+05:30";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateString(value) {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Today's calendar date in the clinic time zone, as "YYYY-MM-DD". */
export function todayInClinicZone(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: clinic.timeZone }).format(now);
}

export function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Weekday of a calendar date: 0 = Sunday ... 6 = Saturday. */
export function weekdayOf(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

/** Exact instant for a clinic-local date and "HH:MM" time. */
export function toInstant(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00${IST_OFFSET}`);
}

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Why a date can't be booked (or null if the date is open), ignoring existing bookings. */
export function dateClosedReason(doctor, dateStr, now = new Date()) {
  if (!isValidDateString(dateStr)) return "invalid";
  const today = todayInClinicZone(now);
  if (dateStr < today) return "past";
  if (dateStr > addDays(today, scheduling.bookingWindowDays)) return "too_far";
  if (scheduling.closedWeekdays.includes(weekdayOf(dateStr))) return "closed";
  if (scheduling.holidays.includes(dateStr)) return "holiday";
  if (doctor.leaveDates.includes(dateStr)) return "leave";
  if (!doctor.weekly[weekdayOf(dateStr)]) return "not_working";
  return null;
}

/**
 * Every slot the doctor works on a date, before removing booked ones.
 * Slots never cross a session end, so a break can never be double-used.
 * Returns [{ time: "09:00", start: Date, end: Date }]
 */
export function generateSlots(doctor, dateStr, now = new Date()) {
  if (dateClosedReason(doctor, dateStr, now)) return [];
  const earliest = now.getTime() + scheduling.minNoticeHours * 3600 * 1000;
  const slots = [];
  for (const [from, to] of doctor.weekly[weekdayOf(dateStr)]) {
    for (let t = toMinutes(from); t + doctor.slotMinutes <= toMinutes(to); t += doctor.slotMinutes) {
      const time = toHHMM(t);
      const start = toInstant(dateStr, time);
      if (start.getTime() < earliest) continue; // minimum advance notice
      slots.push({ time, start, end: new Date(start.getTime() + doctor.slotMinutes * 60000) });
    }
  }
  return slots;
}

/** Key used by the database unique index: one active booking per doctor per slot start. */
export const slotKeyFor = (doctorId, start) => `${doctorId}|${start.toISOString()}`;

/** Dates in the booking window with an open/closed flag (for the date picker). */
export function listBookingDates(doctor, now = new Date()) {
  const today = todayInClinicZone(now);
  const dates = [];
  for (let i = 0; i <= scheduling.bookingWindowDays; i++) {
    const date = addDays(today, i);
    // A date is selectable if the doctor works it and at least one slot is still in the future.
    dates.push({ date, open: generateSlots(doctor, date, now).length > 0 });
  }
  return dates;
}

// ---- Display helpers (always in the clinic time zone) ----
export const formatDate = (instant) =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: clinic.timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(instant);

export const formatTime = (instant) =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: clinic.timeZone, hour: "numeric", minute: "2-digit", hour12: true,
  }).format(instant);
