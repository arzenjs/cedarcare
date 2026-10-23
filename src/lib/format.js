const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const to12h = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${((h + 11) % 12) + 1}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
};

export const doctorDays = (doctor) =>
  Object.keys(doctor.weekly).map(Number).sort().map((d) => DAY[d]).join(", ");

// Weekly timetable rows for the detail page: [{ day, hours }]
export const doctorTimetable = (doctor) =>
  Object.keys(doctor.weekly).map(Number).sort().map((d) => ({
    day: DAY[d],
    hours: doctor.weekly[d].map(([a, b]) => `${to12h(a)} – ${to12h(b)}`).join(" and "),
  }));

export const shortDate = (dateStr) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" })
    .format(new Date(`${dateStr}T00:00:00Z`));

export const timeLabel = (hhmm) => to12h(hhmm);
