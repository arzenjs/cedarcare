// One-time setup: creates the FIRST administrator.
//   npm run create-admin
// Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env.local. Safe to run again: if any admin
// already exists it does nothing. There is deliberately no web endpoint for this.

import mongoose from "mongoose";
import User from "../src/models/User.js";
import { hashPassword, passwordProblem } from "../src/lib/password.js";

const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";
const uri = process.env.MONGODB_URI;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

if (!uri) fail("MONGODB_URI is not set (check .env.local).");
if (!email || email.endsWith("@example.com")) fail("Set ADMIN_EMAIL in .env.local to a real address you control.");
const problem = passwordProblem(password, email);
if (problem || password.length < 12) fail(problem || "Use a password of at least 12 characters for the administrator.");

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  if (await User.exists({ role: "admin" })) {
    console.log("An administrator already exists. Nothing to do.");
  } else {
    await User.create({ email, name: "Clinic Administrator", passwordHash: await hashPassword(password), role: "admin" });
    console.log(`✓ Administrator created: ${email}`);
    console.log("  Sign in at /staff/login, then remove ADMIN_PASSWORD from .env.local.");
  }
} catch (err) {
  fail(`Could not complete setup: ${err.message}`);
} finally {
  await mongoose.disconnect();
}
