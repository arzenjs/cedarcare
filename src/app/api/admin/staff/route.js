import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/access";
import { createInvitation, INVITE_TTL_HOURS } from "@/services/invitations";
import { sendInvitationEmail } from "@/lib/email";
import Invitation from "@/models/Invitation";

// POST /api/admin/staff   body: { email, role }   (admin only)
export async function POST(request) {
  const { user, error } = await requireApiUser("admin");
  if (error) return error;

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }

  try {
    const created = await createInvitation({ email: body?.email, role: body?.role, invitedBy: user.id });
    if (!created.ok) return NextResponse.json({ ok: false, error: created.error }, { status: 400 });

    const sent = await sendInvitationEmail({ to: created.invitation.email, role: created.invitation.role, token: created.token, invitedByName: user.name, hours: INVITE_TTL_HOURS });
    await Invitation.updateOne({ _id: created.invitation._id }, { $set: { emailState: sent.ok ? "sent" : sent.skipped ? "skipped" : "failed" } });

    // The token is never returned to the browser.
    return NextResponse.json({
      ok: true,
      emailSent: sent.ok,
      message: sent.ok ? `Invitation sent to ${created.invitation.email}.` : "Invitation saved, but the email could not be sent. Check the email settings, then invite again.",
    }, { status: 201 });
  } catch (err) {
    console.error("Invite failed:", err.message);
    return NextResponse.json({ ok: false, error: "Could not create the invitation." }, { status: 500 });
  }
}
