import bcrypt from "bcryptjs";

// bcrypt only reads the first 72 bytes, so we cap length rather than silently truncating.
export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 72;

export const hashPassword = (plain) => bcrypt.hash(plain, 12);
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

export function passwordProblem(password, email = "") {
  if (typeof password !== "string" || password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (password.length > PASSWORD_MAX) return `Password must be at most ${PASSWORD_MAX} characters.`;
  if (email && password.toLowerCase() === email.toLowerCase()) return "Password must not be your email address.";
  return null;
}

// Compared against when an email is unknown, so unknown and known emails take similar time.
export const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);
