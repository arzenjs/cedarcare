import { connectDB } from "../lib/db.js";
import User from "../models/User.js";
import Invitation from "../models/Invitation.js";
import { newToken, hashToken } from "../lib/security.js";
import { hashPassword, passwordProblem } from "../lib/password.js";

export const INVITE_TTL_HOURS = 72;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Admin creates an invite. Returns the raw token ONCE (to put in the email); only its hash is stored. */
export async function createInvitation({ email, role, invitedBy, now = new Date() }) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(cleanEmail)) return { ok: false, error: "Enter a valid email address." };
  if (!["admin", "staff"].includes(role)) return { ok: false, error: "Choose a valid role." };

  await connectDB();
  // A new invite replaces any older unused ones for the same email.
  await Invitation.updateMany({ email: cleanEmail, usedAt: null, revokedAt: null }, { $set: { revokedAt: now } });

  const token = newToken();
  const invitation = await Invitation.create({
    email: cleanEmail,
    role,
    tokenHash: hashToken(token),
    expiresAt: new Date(now.getTime() + INVITE_TTL_HOURS * 3600 * 1000),
    invitedBy,
  });
  return { ok: true, invitation, token };
}

const validFilter = (tokenHash, now) => ({ tokenHash, usedAt: null, revokedAt: null, expiresAt: { $gt: now } });

/** Looks up an invite that is unused, not revoked and not expired. */
export async function findValidInvitation(token, now = new Date()) {
  if (typeof token !== "string" || token.length < 20 || token.length > 100) return null;
  await connectDB();
  return Invitation.findOne(validFilter(hashToken(token), now)).lean();
}

/**
 * Accepts an invite.
 * 1. Consume the token atomically (findOneAndUpdate) so two requests can never both use it.
 * 2. If the email already has an account, change NOTHING about that account.
 * 3. Otherwise create the account with the role stored in the invite (never from the browser).
 */
export async function acceptInvitation(token, { name, password }, now = new Date()) {
  if (typeof token !== "string" || token.length < 20 || token.length > 100) return { ok: false, code: "invalid" };
  await connectDB();

  const invite = await Invitation.findOne({ tokenHash: hashToken(token) }).lean();
  if (!invite) return { ok: false, code: "invalid" };
  if (invite.usedAt) return { ok: false, code: "used" };
  if (invite.revokedAt) return { ok: false, code: "revoked" };
  if (invite.expiresAt <= now) return { ok: false, code: "expired" };

  const existing = await User.findOne({ email: invite.email }).select("_id").lean();
  const cleanName = String(name || "").trim().replace(/\s+/g, " ");
  if (!existing) {
    if (cleanName.length < 2 || cleanName.length > 80) return { ok: false, code: "bad_input", error: "Enter your full name." };
    const problem = passwordProblem(password, invite.email);
    if (problem) return { ok: false, code: "bad_input", error: problem };
  }

  const consumed = await Invitation.findOneAndUpdate(validFilter(hashToken(token), now), { $set: { usedAt: now } });
  if (!consumed) return { ok: false, code: "used" }; // someone else used it a moment ago

  if (existing) return { ok: true, existing: true, email: invite.email };

  try {
    const user = await User.create({
      email: invite.email,
      name: cleanName,
      passwordHash: await hashPassword(password),
      role: invite.role,
      createdBy: invite.invitedBy,
    });
    return { ok: true, existing: false, email: user.email, role: user.role };
  } catch (err) {
    await Invitation.updateOne({ _id: invite._id }, { $unset: { usedAt: "" } }); // let them retry
    throw err;
  }
}
