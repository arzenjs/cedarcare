import test from "node:test";
import assert from "node:assert/strict";
import { monthGrid, shiftMonth, monthOf, monthLabel } from "../src/lib/calendar.js";
import { listBookingDates, toInstant } from "../src/lib/scheduling.js";
import { getDoctor } from "../src/data/doctors.js";

test("month grid starts on the right weekday and pads to full weeks", () => {
  const cells = monthGrid("2026-11"); // 1 Nov 2026 is a Sunday, 30 days
  assert.equal(cells[0], "2026-11-01");
  assert.equal(cells.filter(Boolean).length, 30);
  assert.equal(cells.length % 7, 0);
  const oct = monthGrid("2026-10"); // 1 Oct 2026 is a Thursday
  assert.deepEqual(oct.slice(0, 5), [null, null, null, null, "2026-10-01"]);
});

test("month shifting crosses year boundaries", () => {
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
  assert.equal(shiftMonth("2026-01", -1), "2025-12");
  assert.equal(monthOf("2026-10-24"), "2026-10");
  assert.equal(monthLabel("2026-10"), "October 2026");
});

test("calendar data respects each doctor's days, Sundays and holidays", () => {
  const now = toInstant("2026-10-26", "08:00"); // a Monday
  const open = (id) => new Set(listBookingDates(getDoctor(id), now).filter((d) => d.open).map((d) => d.date));
  const neha = open("neha-singh"); // works Tue, Wed, Fri, Sat only
  assert.ok(!neha.has("2026-10-26")); // Monday: not working
  assert.ok(neha.has("2026-10-27")); // Tuesday
  assert.ok(!neha.has("2026-11-01")); // Sunday
  assert.ok(!open("aditi-sharma").has("2026-11-08")); // Sunday and a clinic holiday
  assert.ok(!listBookingDates(getDoctor("aditi-sharma"), now).some((d) => d.date < "2026-10-26")); // no past dates
});
