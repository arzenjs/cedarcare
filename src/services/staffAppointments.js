import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import { doctors } from "@/data/doctors";
import { escapeRegex } from "@/lib/security";
import { isValidDateString, todayInClinicZone, toInstant } from "@/lib/scheduling";

export const PAGE_SIZE = 15;
const STATUSES = ["scheduled", "checked_in", "completed", "cancelled", "no_show"];

/** Server-side search, filters and pagination. Input comes from the URL, so it is validated here. */
export async function searchAppointments({ q = "", date = "", doctor = "", status = "", page = 1 }, now = new Date()) {
  await connectDB();
  const filter = {};
  const term = String(q).trim().slice(0, 60);

  if (term) {
    if (/^CC-/i.test(term)) {
      filter.reference = term.toUpperCase();
    } else {
      const or = [{ patientName: new RegExp(escapeRegex(term), "i") }];
      const digits = term.replace(/\D/g, "");
      if (digits.length >= 4) or.push({ patientPhone: new RegExp(digits.split("").join("[\\s-]*")) });
      filter.$or = or;
    }
  }
  if (isValidDateString(date)) filter.localDate = date;
  if (doctors.some((d) => d.id === doctor)) filter.doctorId = doctor;
  if (STATUSES.includes(status)) filter.status = status;

  // With no filters at all, show today onwards instead of the whole history.
  if (Object.keys(filter).length === 0) filter.startsAt = { $gte: toInstant(todayInClinicZone(now), "00:00") };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const [items, total] = await Promise.all([
    Appointment.find(filter).sort({ startsAt: 1 }).skip((pageNum - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
    Appointment.countDocuments(filter),
  ]);
  return {
    items: items.map((a) => ({ ...a, _id: String(a._id) })),
    total,
    page: pageNum,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getAppointmentById(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectDB();
  const a = await Appointment.findById(id).populate("statusUpdatedBy", "name").lean();
  return a ? { ...a, _id: String(a._id) } : null;
}

/** Real counts from the database. */
export async function dashboardCounts(now = new Date()) {
  await connectDB();
  const today = todayInClinicZone(now);
  const [today_, upcoming, checkedIn, completedToday, cancelledToday] = await Promise.all([
    Appointment.countDocuments({ localDate: today, status: { $ne: "cancelled" } }),
    Appointment.countDocuments({ startsAt: { $gte: now }, status: "scheduled" }),
    Appointment.countDocuments({ status: "checked_in" }),
    Appointment.countDocuments({ localDate: today, status: "completed" }),
    Appointment.countDocuments({ localDate: today, status: "cancelled" }),
  ]);
  return { today: today_, upcoming, checkedIn, completedToday, cancelledToday };
}

export async function todaysAppointments(now = new Date()) {
  await connectDB();
  const items = await Appointment.find({ localDate: todayInClinicZone(now), status: { $ne: "cancelled" } }).sort({ startsAt: 1 }).lean();
  return items.map((a) => ({ ...a, _id: String(a._id) }));
}
