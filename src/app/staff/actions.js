"use server";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { acceptInvitation } from "@/services/invitations";

const homeFor = (role) => (role === "admin" ? "/admin" : "/staff/dashboard");

async function startSession(email, password) {
  try {
    const result = await signIn("credentials", { email, password, redirect: false });
    // Some versions return an error URL instead of throwing.
    if (typeof result === "string" && result.includes("error")) return false;
    return true;
  } catch (err) {
    if (err instanceof AuthError) return false;
    throw err;
  }
}

export async function loginAction(_prev, formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!(await startSession(email, password))) return { error: "Incorrect email or password, or the account is inactive." };

  // The destination comes from the stored role, never from the browser. No redirect URL is accepted.
  await connectDB();
  const user = await User.findOne({ email }).select("role").lean();
  redirect(homeFor(user?.role));
}

export async function logoutAction() {
  await signOut({ redirectTo: "/staff/login" });
}

export async function acceptInviteAction(_prev, formData) {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  if (password !== String(formData.get("confirm") || "")) return { error: "The passwords do not match." };

  const result = await acceptInvitation(token, { name: formData.get("name"), password });
  if (!result.ok) {
    const messages = {
      expired: "This invitation has expired. Ask an administrator to send a new one.",
      used: "This invitation has already been used. Try signing in instead.",
      revoked: "This invitation was cancelled. Ask an administrator for a new one.",
      invalid: "This invitation link is not valid.",
    };
    return { error: result.error || messages[result.code] || messages.invalid, fatal: !result.error };
  }
  if (result.existing) return { info: "You already have an account, so nothing was changed. Please sign in." };

  if (!(await startSession(result.email, password))) redirect("/staff/login");
  redirect(homeFor(result.role));
}
