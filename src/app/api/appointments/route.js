import { NextResponse } from "next/server";
import { validateBooking } from "@/lib/validation";
import { createAppointment, SlotUnavailableError } from "@/services/appointments";
import { rateLimit, clientIp } from "@/lib/security";

export async function POST(request) {
  const limit = rateLimit(`book:${clientIp(request)}`, { limit: 8, windowMs: 10 * 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please wait a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = validateBooking(body);
  if (parsed.errors) return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 });

  try {
    const { token } = await createAppointment(parsed.value);
    // Only reached after the database write succeeded.
    return NextResponse.json({ ok: true, confirmationToken: token }, { status: 201 });
  } catch (err) {
    if (err instanceof SlotUnavailableError) {
      return NextResponse.json(
        { ok: false, code: "slot_unavailable", error: "That time is no longer available. Please choose another slot." },
        { status: 409 }
      );
    }
    console.error("Booking failed:", err);
    return NextResponse.json(
      { ok: false, error: "We could not save your appointment. Nothing was booked. Please try again or call the clinic." },
      { status: 500 }
    );
  }
}
