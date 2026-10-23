import { NextResponse } from "next/server";
import { doctors } from "@/data/doctors";

export function GET() {
  const list = doctors.map(({ id, name, specialty, summary, slotMinutes, services }) => ({
    id, name, specialty, summary, slotMinutes, services,
  }));
  return NextResponse.json({ ok: true, doctors: list });
}
