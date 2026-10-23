import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import { generateSlots, slotKeyFor } from "@/lib/scheduling";
import { newToken, hashToken, newReference } from "@/lib/security";
import { sendAppointmentConfirmation } from "@/lib/email";

export class SlotUnavailableError extends Error {}

/**
 * Validates the slot on the server and saves the appointment.
 * `input` must already have passed validateBooking().
 * Throws SlotUnavailableError if the slot is invalid or taken; any other error means
 * the database failed (the caller must NOT show a confirmation).
 */
export async function createAppointment(input, now = new Date()) {
  await connectDB();
  // Build the unique indexes BEFORE accepting a booking. Without the slotKey index
  // the double-booking protection would silently not exist.
  await Appointment.init();

  const { doctor, serviceId, date, time } = input;

  // 1. The chosen time must be one of the doctor's real, currently bookable slots.
  const slot = generateSlots(doctor, date, now).find((s) => s.time === time);
  if (!slot) throw new SlotUnavailableError();

  // 2. Insert. The unique slotKey index is the real lock: if another request saved the
  //    same slot a moment ago, MongoDB throws duplicate-key error 11000 for us.
  const token = newToken();
  let appointment;
  for (let attempt = 0; attempt < 3 && !appointment; attempt++) {
    try {
      appointment = await Appointment.create({
        reference: newReference(),
        tokenHash: hashToken(token),
        patientName: input.patientName,
        patientEmail: input.patientEmail,
        patientPhone: input.patientPhone,
        note: input.note,
        consentAt: now,
        doctorId: doctor.id,
        service: serviceId,
        startsAt: slot.start,
        endsAt: slot.end,
        localDate: date,
        localTime: time,
        slotKey: slotKeyFor(doctor.id, slot.start),
      });
    } catch (err) {
      if (err?.code !== 11000) throw err;
      if (err.keyPattern?.slotKey) throw new SlotUnavailableError();
      // Otherwise the random reference collided (extremely rare): loop and try a new one.
    }
  }
  if (!appointment) throw new Error("Could not generate a unique appointment reference.");

  // 3. Email is a separate step. Whatever happens here, the booking stays saved.
  await deliverConfirmationEmail(appointment);

  return { appointment, token };
}

/** Sends the confirmation email and records the outcome. Also used for retries. */
export async function deliverConfirmationEmail(appointment) {
  const result = await sendAppointmentConfirmation(appointment);
  const state = result.ok ? "sent" : result.skipped ? "skipped" : "failed";
  try {
    await Appointment.updateOne(
      { _id: appointment._id },
      {
        $set: {
          "emailStatus.state": state,
          "emailStatus.lastError": result.ok ? "" : result.error,
          ...(result.ok ? { "emailStatus.sentAt": new Date() } : {}),
        },
        $inc: { "emailStatus.attempts": 1 },
      }
    );
  } catch (err) {
    console.error("Could not record email status:", err.message);
  }
  if (!result.ok && !result.skipped) console.error("Confirmation email failed:", result.error);
  return result;
}

export async function findByConfirmationToken(token) {
  if (typeof token !== "string" || token.length < 20 || token.length > 100) return null;
  await connectDB();
  return Appointment.findOne({ tokenHash: hashToken(token) }).lean();
}
