import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/access";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import { deliverConfirmationEmail } from "@/services/appointments";

// POST /api/admin/appointments/:id/email   retries a failed confirmation email (admin only)
export async function POST(_request, { params }) {
  const { error } = await requireApiUser("admin");
  if (error) return error;

  const { appointmentId } = await params;
  if (!mongoose.isValidObjectId(appointmentId)) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  await connectDB();
  const appt = await Appointment.findById(appointmentId);
  if (!appt) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  const result = await deliverConfirmationEmail(appt);
  return NextResponse.json({ ok: result.ok, error: result.ok ? undefined : "The email could not be sent. Check the email settings." }, { status: result.ok ? 200 : 502 });
}
