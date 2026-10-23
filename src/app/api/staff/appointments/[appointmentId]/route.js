import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/access";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import { buildStatusUpdate } from "@/lib/statusTransitions";

// PATCH /api/staff/appointments/:id   body: { status }
export async function PATCH(request, { params }) {
  const { user, error } = await requireApiUser("staff");
  if (error) return error;

  const { appointmentId } = await params;
  if (!mongoose.isValidObjectId(appointmentId)) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }
  if (typeof body?.status !== "string") return NextResponse.json({ ok: false, error: "Missing status." }, { status: 400 });

  try {
    await connectDB();
    const appt = await Appointment.findById(appointmentId).select("status startsAt").lean();
    if (!appt) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

    const result = buildStatusUpdate({ current: appt.status, next: body.status, startsAt: appt.startsAt, userId: user.id });
    if (!result.ok) {
      const msg = result.reason === "too_early" ? "A patient can only be marked as a no-show after the appointment time." : "That status change is not allowed.";
      return NextResponse.json({ ok: false, error: msg }, { status: 409 });
    }

    // Matching on the current status makes this atomic: if someone else changed it first, nothing is updated.
    const updated = await Appointment.findOneAndUpdate({ _id: appointmentId, status: appt.status }, result.update, { new: true }).select("status");
    if (!updated) return NextResponse.json({ ok: false, error: "This appointment was just updated by someone else. Refresh and try again." }, { status: 409 });
    return NextResponse.json({ ok: true, status: updated.status });
  } catch (err) {
    console.error("Status update failed:", err.message);
    return NextResponse.json({ ok: false, error: "Could not update the appointment." }, { status: 500 });
  }
}
