import Link from "next/link";
import { findValidInvitation } from "@/services/invitations";
import InviteAcceptForm from "@/components/dashboard/InviteAcceptForm";

export const metadata = { title: "Accept invitation", robots: { index: false, follow: false } };

export default async function InvitePage({ searchParams }) {
  const { token } = await searchParams;
  const invite = await findValidInvitation(token);

  return (
    <div className="page-width max-w-md py-20">
      <h1 className="text-4xl text-cedar-dark">Join the staff portal</h1>
      {invite ? (
        <div className="mt-8"><InviteAcceptForm token={token} email={invite.email} /></div>
      ) : (
        <div className="mt-6" role="alert">
          <p className="text-muted">This invitation link is invalid, expired, cancelled or already used.</p>
          <p className="mt-2 text-muted">Ask a clinic administrator to send you a new invitation, or sign in if you already have an account.</p>
          <Link href="/staff/login" className="btn btn-primary mt-6">Go to sign in</Link>
        </div>
      )}
    </div>
  );
}
