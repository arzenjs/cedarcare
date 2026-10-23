// Single source of truth for clinic details. Edit here and the whole site updates.
// All details are DEMO placeholders for a portfolio project.

export const clinic = {
  name: "CedarCare Family Clinic",
  tagline: "Thoughtful Care. Healthier Tomorrows.",
  address: "Bailey Road, Patna, Bihar, India",
  phone: "+91 98765 43210",
  email: "hello@cedarcare.example",
  appointmentsEmail: "appointments@cedarcare.example",
  whatsappNumber: "919876543210", // digits only, with country code
  timeZone: "Asia/Kolkata",
  hoursText: [
    { days: "Monday – Saturday", hours: "9:00 AM – 7:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
};

// Scheduling rules shared by the website and the booking server.
export const scheduling = {
  bookingWindowDays: 30, // how far ahead patients can book
  minNoticeHours: 2, // earliest bookable time = now + this
  closedWeekdays: [0], // 0 = Sunday
  // Clinic-wide closed dates, format "YYYY-MM-DD"
  holidays: ["2026-11-08"],
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const telHref = `tel:${clinic.phone.replace(/\s/g, "")}`;
export const mailHref = `mailto:${clinic.email}`;
export const whatsappHref = `https://wa.me/${clinic.whatsappNumber}?text=${encodeURIComponent(
  "Hello CedarCare, I have a question about booking an appointment."
)}`;
export const mapsSearchHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`;
export const mapsDirectionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinic.address)}`;
