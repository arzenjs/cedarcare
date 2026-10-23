// Integration tests that need a real MongoDB. They are SKIPPED unless TEST_MONGODB_URI is set:
//   TEST_MONGODB_URI=mongodb://127.0.0.1:27017/cedarcare_test npm test
// Use a throwaway database: these tests delete the data they create.

import test, { before, after } from "node:test";
import assert from "node:assert/strict";

const uri = process.env.TEST_MONGODB_URI;
const opts = { skip: uri ? false : "TEST_MONGODB_URI is not set" };
let mongoose, Appointment, User, Invitation, invitations;

before(async () => {
  if (!uri) return;
  mongoose = (await import("mongoose")).default;
  process.env.MONGODB_URI = uri;
  Appointment = (await import("../src/models/Appointment.js")).default;
  User = (await import("../src/models/User.js")).default;
  Invitation = (await import("../src/models/Invitation.js")).default;
  invitations = await import("../src/services/invitations.js");
  await mongoose.connect(uri);
  await Promise.all([Appointment.init(), User.init(), Invitation.init()]);
  await Promise.all([Appointment.deleteMany({}), User.deleteMany({}), Invitation.deleteMany({})]);
});
after(async () => { if (uri) await mongoose.disconnect(); });

const appt = (slotKey, n) => ({
  reference: `CC-TEST${n}`, tokenHash: `hash-${slotKey}-${n}`, patientName: "Test", patientEmail: "t@example.com",
  patientPhone: "9876543210", consentAt: new Date(), doctorId: "aditi-sharma", service: "follow-up",
  startsAt: new Date("2030-01-07T04:00:00Z"), endsAt: new Date("2030-01-07T04:20:00Z"),
  localDate: "2030-01-07", localTime: "09:30", slotKey,
});

test("20 simultaneous bookings of one slot: exactly one wins", opts, async () => {
  const results = await Promise.allSettled(Array.from({ length: 20 }, (_, i) => Appointment.create(appt("aditi-sharma|2030-01-07T04:00:00.000Z", i))));
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  for (const r of results.filter((x) => x.status === "rejected")) assert.equal(r.reason.code, 11000);
});

test("cancelling frees the slot for a new booking", opts, async () => {
  const key = "aditi-sharma|2030-01-08T04:00:00.000Z";
  const first = await Appointment.create(appt(key, 100));
  await assert.rejects(Appointment.create(appt(key, 101)));
  await Appointment.updateOne({ _id: first._id }, { $set: { status: "cancelled" }, $unset: { slotKey: "" } });
  await Appointment.create(appt(key, 102)); // succeeds now
});

test("invitation: single use, even under concurrency", opts, async () => {
  const admin = await User.create({ email: "a@x.com", name: "A", passwordHash: "x", role: "admin" });
  const { token } = await invitations.createInvitation({ email: "new@x.com", role: "staff", invitedBy: admin._id });
  const results = await Promise.all(Array.from({ length: 5 }, () => invitations.acceptInvitation(token, { name: "New Person", password: "a-long-password-1" })));
  assert.equal(results.filter((r) => r.ok).length, 1);
  assert.equal(await User.countDocuments({ email: "new@x.com" }), 1);
  assert.equal((await User.findOne({ email: "new@x.com" })).role, "staff");
});

test("invitation: expired and revoked tokens are refused", opts, async () => {
  const admin = await User.findOne({ role: "admin" });
  const old = await invitations.createInvitation({ email: "late@x.com", role: "staff", invitedBy: admin._id, now: new Date(Date.now() - 4 * 86400_000) });
  assert.equal((await invitations.acceptInvitation(old.token, { name: "Late", password: "a-long-password-1" })).code, "expired");
  const fresh = await invitations.createInvitation({ email: "gone@x.com", role: "staff", invitedBy: admin._id });
  await Invitation.updateOne({ _id: fresh.invitation._id }, { $set: { revokedAt: new Date() } });
  assert.equal((await invitations.acceptInvitation(fresh.token, { name: "Gone", password: "a-long-password-1" })).code, "revoked");
});

test("invitation for an existing user changes nothing about that account", opts, async () => {
  const admin = await User.findOne({ role: "admin" });
  const { token } = await invitations.createInvitation({ email: "a@x.com", role: "staff", invitedBy: admin._id }); // admin's own email, 'staff' role
  const r = await invitations.acceptInvitation(token, { name: "Hacker", password: "a-long-password-1" });
  assert.equal(r.existing, true);
  const after = await User.findOne({ email: "a@x.com" }).select("+passwordHash");
  assert.equal(after.role, "admin");
  assert.equal(after.passwordHash, "x");
});
