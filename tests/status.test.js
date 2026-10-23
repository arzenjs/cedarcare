import test from "node:test";
import assert from "node:assert/strict";
import { buildStatusUpdate, TRANSITIONS } from "../src/lib/statusTransitions.js";

const past = new Date(Date.now() - 3600_000);
const future = new Date(Date.now() + 3600_000);
const base = { userId: "u1", startsAt: past };

test("allowed transitions", () => {
  assert.ok(buildStatusUpdate({ ...base, current: "scheduled", next: "checked_in" }).ok);
  assert.ok(buildStatusUpdate({ ...base, current: "checked_in", next: "completed" }).ok);
  assert.ok(buildStatusUpdate({ ...base, current: "scheduled", next: "cancelled" }).ok);
  assert.ok(buildStatusUpdate({ ...base, current: "scheduled", next: "no_show" }).ok);
});

test("invalid transitions are rejected", () => {
  assert.equal(buildStatusUpdate({ ...base, current: "scheduled", next: "completed" }).ok, false); // must check in first
  assert.equal(buildStatusUpdate({ ...base, current: "completed", next: "cancelled" }).ok, false);
  assert.equal(buildStatusUpdate({ ...base, current: "cancelled", next: "scheduled" }).ok, false);
  assert.equal(buildStatusUpdate({ ...base, current: "scheduled", next: "banana" }).ok, false);
  for (const terminal of ["completed", "cancelled", "no_show"]) assert.deepEqual(TRANSITIONS[terminal], []);
});

test("no-show is not allowed before the appointment time", () => {
  const r = buildStatusUpdate({ current: "scheduled", next: "no_show", startsAt: future, userId: "u1" });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "too_early");
});

test("cancelling frees the slot and records who and when", () => {
  const now = new Date();
  const { update } = buildStatusUpdate({ ...base, current: "scheduled", next: "cancelled", now });
  assert.deepEqual(update.$unset, { slotKey: "" });
  assert.equal(update.$set.status, "cancelled");
  assert.equal(update.$set.statusUpdatedBy, "u1");
  assert.equal(update.$set.cancelledAt, now);
});

test("check-in keeps the slot reserved", () => {
  const { update } = buildStatusUpdate({ ...base, current: "scheduled", next: "checked_in" });
  assert.equal(update.$unset, undefined);
});
