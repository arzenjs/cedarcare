import { requireUser } from "@/lib/access";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Invitation from "@/models/Invitation";
import StaffShell from "@/components/dashboard/StaffShell";
import { InviteForm, ToggleActive, RevokeInvite } from "@/components/dashboard/AdminStaffPanel";

export const metadata = { title: "Staff accounts" };
export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const user = await requireUser("admin");
  await connectDB();
  const [users, invites] = await Promise.all([
    User.find({}).sort({ createdAt: 1 }).select("email name role isActive lastLoginAt").lean(), // passwordHash is not selected
    Invitation.find({ usedAt: null, revokedAt: null, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).select("email role expiresAt emailState").lean(),
  ]);
  const fmt = (d) => (d ? new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }).format(d) : "Never");

  return (
    <StaffShell user={user} title="Staff accounts">
      <section aria-labelledby="invite-h" className="rounded-lg border border-line bg-white p-5">
        <h2 id="invite-h" className="mb-4 text-xl text-cedar-dark">Invite someone</h2>
        <InviteForm />
      </section>

      <h2 className="mt-10 text-2xl text-cedar-dark">Accounts</h2>
      <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-white">
        {users.map((u) => (
          <li key={String(u._id)} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
            <span><span className="font-semibold">{u.name}</span> · {u.email} · {u.role} · <span className={u.isActive ? "text-cedar" : "text-danger"}>{u.isActive ? "Active" : "Inactive"}</span><br /><span className="text-muted">Last sign-in: {fmt(u.lastLoginAt)}</span></span>
            <ToggleActive userId={String(u._id)} isActive={u.isActive} disabled={String(u._id) === user.id} />
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl text-cedar-dark">Pending invitations</h2>
      {invites.length === 0 ? <p className="mt-3 text-muted">No pending invitations.</p> : (
        <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-white">
          {invites.map((i) => (
            <li key={String(i._id)} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <span>{i.email} · {i.role} · expires {fmt(i.expiresAt)} · email {i.emailState}</span>
              <RevokeInvite invitationId={String(i._id)} />
            </li>
          ))}
        </ul>
      )}
    </StaffShell>
  );
}
