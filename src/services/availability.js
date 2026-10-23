import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import { generateSlots, slotKeyFor } from "@/lib/scheduling";

/** Slots for one doctor/date that are open AND not already booked. Convenience only:
 *  createAppointment() re-checks everything on the server at booking time. */
export async function getAvailableSlots(doctor, date, now = new Date()) {
  const slots = generateSlots(doctor, date, now);
  if (slots.length === 0) return [];
  await connectDB();
  const taken = await Appointment.find({
    slotKey: { $in: slots.map((s) => slotKeyFor(doctor.id, s.start)) },
  })
    .select("slotKey")
    .lean();
  const takenKeys = new Set(taken.map((t) => t.slotKey));
  return slots.filter((s) => !takenKeys.has(slotKeyFor(doctor.id, s.start))).map((s) => s.time);
}
