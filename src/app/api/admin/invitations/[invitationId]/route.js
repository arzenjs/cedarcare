import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/access";
import { connectDB } from "@/lib/db";
import Invitation from "@/models/Invitation";

// DELETE /api/admin/invitations/:id  revokes an unused invitation (admin only)
export async function DELETE(_request, { params }) {
  const { error } = await requireApiUser("admin");
  if (error) return error;

  const { invitationId } = await params;
  if (!mongoose.isValidObjectId(invitationId)) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  await connectDB();
  const res = await Invitation.updateOne({ _id: invitationId, usedAt: null, revokedAt: null }, { $set: { revokedAt: new Date() } });
  if (res.matchedCount === 0) return NextResponse.json({ ok: false, error: "Invitation not found or already used." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
