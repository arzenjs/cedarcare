import mongoose from "mongoose";

const emailStatusSchema = new mongoose.Schema(
  {
    // pending -> sent | failed | skipped (skipped = email not configured)
    state: { type: String, enum: ["pending", "sent", "failed", "skipped"], default: "pending" },
    attempts: { type: Number, default: 0 },
    lastError: { type: String, default: "" }, // short, safe text; never shown to patients
    sentAt: Date,
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true }, // public, e.g. CC-7K3M9QXA
    tokenHash: { type: String, required: true, unique: true }, // hash of the confirmation-link token

    patientName: { type: String, required: true, maxlength: 80 },
    patientEmail: { type: String, required: true, lowercase: true, maxlength: 120 },
    patientPhone: { type: String, required: true, maxlength: 20 },
    note: { type: String, default: "", maxlength: 300 },
    consentAt: { type: Date, required: true },

    doctorId: { type: String, required: true }, // id from src/data/doctors.js
    service: { type: String, required: true },

    // Canonical instants (UTC in the database) plus the clinic-local values for display/search.
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    localDate: { type: String, required: true }, // "YYYY-MM-DD" in Asia/Kolkata
    localTime: { type: String, required: true }, // "HH:MM" in Asia/Kolkata
    timeZone: { type: String, default: "Asia/Kolkata" },

    status: {
      type: String,
      enum: ["scheduled", "checked_in", "completed", "cancelled", "no_show"],
      default: "scheduled",
    },

    // DOUBLE-BOOKING GUARD.
    // Slots are fixed-length and generated from one function, so two bookings overlap
    // only if they share the exact same start. slotKey = "doctorId|startISO" with a
    // UNIQUE index lets MongoDB reject the second insert atomically, even when two
    // requests arrive at the same millisecond. Cancelling a booking $unsets slotKey,
    // which frees the slot (the index is sparse, so missing values are ignored).
    slotKey: { type: String },

    checkedInAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    noShowAt: Date,
    statusUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    emailStatus: { type: emailStatusSchema, default: () => ({}) },
  },
  { timestamps: true }
);

appointmentSchema.index({ slotKey: 1 }, { unique: true, sparse: true });
appointmentSchema.index({ startsAt: 1 });
appointmentSchema.index({ doctorId: 1, startsAt: 1 });
appointmentSchema.index({ status: 1, startsAt: 1 });
appointmentSchema.index({ patientPhone: 1 });

export default mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
