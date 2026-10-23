"use client";
import { useActionState } from "react";
import { loginAction } from "@/app/staff/actions";

export default function LoginForm({ expired }) {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="space-y-5">
      {expired && !state && <p className="rounded-lg bg-mist p-3 text-sm text-cedar-dark" role="status">Your session ended. Please sign in again.</p>}
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field-input" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field-input" />
      </div>
      {state?.error && <p className="field-error" role="alert">{state.error}</p>}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
