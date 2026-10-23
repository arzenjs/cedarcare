import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "./auth.js";
import { connectDB } from "./db.js";
import User from "../models/User.js";

// Authorization is decided here, from trusted database data (never from the browser,
// and never from claims stored inside the session token).

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  await connectDB();
  const user = await User.findById(session.user.id).select("email name role isActive").lean();
  if (!user || !user.isActive) return null;
  return { id: String(user._id), email: user.email, name: user.name, role: user.role };
}

/** For pages. Redirects to login when signed out; sends staff away from admin-only pages. */
export async function requireUser(requiredRole = "staff") {
  const user = await getCurrentUser();
  if (!user) redirect("/staff/login");
  if (requiredRole === "admin" && user.role !== "admin") redirect("/staff/dashboard");
  return user;
}

/** For route handlers. Returns { user } or { error } (a ready 401/403 response). */
export async function requireApiUser(requiredRole = "staff") {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ ok: false, error: "Please sign in again." }, { status: 401 }) };
  if (requiredRole === "admin" && user.role !== "admin") {
    return { error: NextResponse.json({ ok: false, error: "You do not have permission to do this." }, { status: 403 }) };
  }
  return { user };
}
