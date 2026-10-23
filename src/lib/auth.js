import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { verifyPassword, DUMMY_HASH } from "./password.js";
import { rateLimit } from "./security.js";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // sessions expire after 8 hours
  pages: { signIn: "/staff/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials, request) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password || password.length > 200) return null;

        // Slow down password guessing per email and per IP (in-memory; see security.js note).
        const ip = request?.headers?.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
        if (!rateLimit(`login-email:${email}`, { limit: 8, windowMs: 15 * 60_000 }).ok) return null;
        if (!rateLimit(`login-ip:${ip}`, { limit: 30, windowMs: 15 * 60_000 }).ok) return null;

        await connectDB();
        const user = await User.findOne({ email }).select("+passwordHash");
        const valid = await verifyPassword(password, user?.passwordHash || DUMMY_HASH);
        if (!user || !valid || !user.isActive) return null; // same result for every failure

        user.lastLoginAt = new Date();
        await user.save();
        return { id: String(user._id), email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    // The token only carries the user id. The role is ALWAYS re-read from the database
    // (see lib/access.js), so a deactivated or demoted user loses access immediately.
    jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.uid;
      return session;
    },
  },
});
