// The ONLY place that decides which appointment status changes are allowed.
// The server applies this on every update, so a client cannot jump to an arbitrary status.

export const TRANSITIONS = {
  scheduled: ["checked_in", "cancelled", "no_show"],
  checked_in: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  no_show: [],
};

const TIMESTAMP_FIELD = { checked_in: "checkedInAt", completed: "completedAt", cancelled: "cancelledAt", no_show: "noShowAt" };

/**
 * Returns { ok: true, update } (a MongoDB update document) or { ok: false, reason }.
 * Cancelling or marking no-show also removes slotKey, which frees the slot for rebooking.
 */
export function buildStatusUpdate({ current, next, startsAt, userId, now = new Date() }) {
  if (!(TRANSITIONS[current] || []).includes(next)) return { ok: false, reason: "invalid_transition" };
  if (next === "no_show" && new Date(startsAt) > now) return { ok: false, reason: "too_early" };

  const update = { $set: { status: next, statusUpdatedBy: userId, [TIMESTAMP_FIELD[next]]: now } };
  if (next === "cancelled" || next === "no_show") update.$unset = { slotKey: "" };
  return { ok: true, update };
}
