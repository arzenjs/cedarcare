import test from "node:test";
import assert from "node:assert/strict";
import { generateSlots, dateClosedReason, slotKeyFor, toInstant, addDays, weekdayOf, listBookingDates } from "../src/lib/scheduling.js";
import { validateBooking } from "../src/lib/validation.js";
import { getDoctor } from "../src/data/doctors.js";

// Fixed "now": Monday 2026-10-26, 08:00 IST
const NOW = toInstant("2026-10-26", "08:00");
const aditi = getDoctor("aditi-sharma");
const neha = getDoctor("neha-singh");

test("weekday helper", () => {
  assert.equal(weekdayOf("2026-10-26"), 1);
  assert.equal(weekdayOf("2026-11-01"), 0);
});

test("generates 20-minute slots with a lunch break", () => {
  const times = generateSlots(aditi, "2026-10-27", NOW).map((s) => s.time);
  assert.equal(times[0], "09:00");
  assert.ok(times.includes("12:40"));
  assert.ok(!times.includes("13:00")); // session end, no slot
  assert.ok(!times.includes("14:00")); // break
  assert.ok(times.includes("15:00"));
  assert.equal(times.at(-1), "18:40");
});

test("different doctors use different durations", () => {
  const times = generateSlots(neha, "2026-10-27", NOW).map((s) => s.time);
  assert.deepEqual(times.slice(0, 3), ["11:00", "11:30", "12:00"]);
});

test("Sunday, holidays, leave and non-working days are closed", () => {
  assert.equal(dateClosedReason(aditi, "2026-11-01", NOW), "closed");
  assert.equal(dateClosedReason(aditi, "2026-11-08", NOW), "closed"); // Sunday
  assert.equal(dateClosedReason(neha, "2026-10-26", NOW), "not_working"); // Monday
  assert.equal(dateClosedReason(aditi, "2026-10-25", NOW), "past");
  assert.equal(dateClosedReason(aditi, "2027-03-01", NOW), "too_far");
  assert.equal(dateClosedReason({ ...aditi, leaveDates: ["2026-10-28"] }, "2026-10-28", NOW), "leave");
});

test("minimum notice hides near-term slots", () => {
  const sameDay = generateSlots(aditi, "2026-10-26", NOW).map((s) => s.time);
  assert.ok(!sameDay.includes("09:40")); // before 10:00 (now + 2h)
  assert.ok(sameDay.includes("10:00"));
});

test("slot instants are exact IST times", () => {
  const first = generateSlots(aditi, "2026-10-27", NOW)[0];
  assert.equal(first.start.toISOString(), "2026-10-27T03:30:00.000Z"); // 09:00 IST
  assert.equal(first.end.getTime() - first.start.getTime(), 20 * 60000);
});

test("slotKey is identical for the same doctor and start (what the unique index relies on)", () => {
  const a = generateSlots(aditi, "2026-10-27", NOW)[0];
  const b = generateSlots(aditi, "2026-10-27", NOW)[0];
  assert.equal(slotKeyFor(aditi.id, a.start), slotKeyFor(aditi.id, b.start));
  assert.notEqual(slotKeyFor("rohan-verma", a.start), slotKeyFor(aditi.id, a.start));
});

test("date picker list covers the booking window", () => {
  const dates = listBookingDates(aditi, NOW);
  assert.equal(dates.length, 31);
  assert.equal(dates[0].date, "2026-10-26");
  assert.equal(addDays("2026-10-26", 30), dates.at(-1).date);
});

const goodBooking = {
  doctorId: "aditi-sharma", service: "general-consultation", date: "2026-10-27", time: "09:00",
  patientName: "Test Patient", patientEmail: "Test@Example.com", patientPhone: "+91 98765 00000",
  note: "", consent: true,
};

test("valid booking passes and normalises email", () => {
  const { value, errors } = validateBooking(goodBooking);
  assert.equal(errors, undefined);
  assert.equal(value.patientEmail, "test@example.com");
});

test("invalid bookings are rejected", () => {
  assert.ok(validateBooking({ ...goodBooking, doctorId: "nobody" }).errors.doctorId);
  assert.ok(validateBooking({ ...goodBooking, service: "skin-consultation" }).errors.service); // not offered by Aditi
  assert.ok(validateBooking({ ...goodBooking, patientEmail: "nope" }).errors.patientEmail);
  assert.ok(validateBooking({ ...goodBooking, patientPhone: "abc" }).errors.patientPhone);
  assert.ok(validateBooking({ ...goodBooking, consent: false }).errors.consent);
  assert.ok(validateBooking({ ...goodBooking, date: "2026-02-30" }).errors.date);
  assert.ok(validateBooking({ ...goodBooking, note: "x".repeat(301) }).errors.note);
  assert.ok(validateBooking(null).errors);
});
