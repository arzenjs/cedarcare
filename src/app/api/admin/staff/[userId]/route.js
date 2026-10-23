import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/access";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// PATCH /api/admin/staff/:id   body: { isActive: boolean }   (admin only)
export async function PATCH(request, { params }) {
  const { user, error } = await requireApiUser("admin");
  if (error) return error;

  const { userId } = await params;
  if (!mongoose.isValidObjectId(userId)) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  if (userId === user.id) return NextResponse.json({ ok: false, error: "You cannot deactivate your own account." }, { status: 400 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }
  if (typeof body?.isActive !== "boolean") return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  await connectDB();
  // Only isActive can change here. Role and password are never taken from this request.
  const updated = await User.findByIdAndUpdate(userId, { $set: { isActive: body.isActive } }, { new: true }).select("isActive");
  if (!updated) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, isActive: updated.isActive });
}
