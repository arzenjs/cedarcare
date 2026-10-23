"use client";
import { useActionState } from "react";
import Link from "next/link";
import { acceptInviteAction } from "@/app/staff/actions";

export default function InviteAcceptForm({ token, email }) {
  const [state, action, pending] = useActionState(acceptInviteAction, null);
  if (state?.info) {
    return (
      <div role="status">
        <p className="text-muted">{state.info}</p>
        <Link href="/staff/login" className="btn btn-primary mt-5">Go to sign in</Link>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <p className="text-sm text-muted">Creating an account for <strong>{email}</strong></p>
      <div>
        <label htmlFor="name" className="field-label">Full name</label>
        <input id="name" name="name" required autoComplete="name" className="field-input" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password (10–72 characters)</label>
        <input id="password" name="password" type="password" required minLength={10} maxLength={72} autoComplete="new-password" className="field-input" />
      </div>
      <div>
        <label htmlFor="confirm" className="field-label">Confirm password</label>
        <input id="confirm" name="confirm" type="password" required autoComplete="new-password" className="field-input" />
      </div>
      {state?.error && <p className="field-error" role="alert">{state.error}</p>}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>{pending ? "Creating account…" : "Create account and sign in"}</button>
    </form>
  );
}
