import { NextResponse } from "next/server";
import { getDoctor } from "@/data/doctors";
import { listBookingDates, isValidDateString } from "@/lib/scheduling";
import { getAvailableSlots } from "@/services/availability";
import { rateLimit, clientIp } from "@/lib/security";

// GET /api/availability?doctorId=X            -> which dates are open
// GET /api/availability?doctorId=X&date=Y     -> free times on that date
export async function GET(request) {
  const limit = rateLimit(`avail:${clientIp(request)}`, { limit: 120, windowMs: 60_000 });
  if (!limit.ok) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });

  const { searchParams } = new URL(request.url);
  const doctor = getDoctor(searchParams.get("doctorId"));
  if (!doctor) return NextResponse.json({ ok: false, error: "Unknown doctor." }, { status: 400 });

  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json({ ok: true, dates: listBookingDates(doctor) }, { headers: { "Cache-Control": "no-store" } });
  }
  if (!isValidDateString(date)) return NextResponse.json({ ok: false, error: "Invalid date." }, { status: 400 });

  try {
    const times = await getAvailableSlots(doctor, date);
    return NextResponse.json({ ok: true, times }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Availability error:", err.message);
    return NextResponse.json({ ok: false, error: "Could not load times. Please try again." }, { status: 500 });
  }
}
