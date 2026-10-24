// Small pure helpers for the booking calendar. Months are "YYYY-MM", days are "YYYY-MM-DD".
// Everything uses UTC arithmetic on calendar dates, so the visitor's own time zone never shifts a day.

const pad = (n) => String(n).padStart(2, "0");

export const monthOf = (dateStr) => dateStr.slice(0, 7);

export function shiftMonth(ym, delta) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + delta, 1)).toISOString().slice(0, 7);
}

/** Flat list of cells for a month grid starting on Sunday: a date string, or null for padding. */
export function monthGrid(ym) {
  const [y, m] = ym.split("-").map(Number);
  const leading = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = Array(leading).fill(null);
  for (let d = 1; d <= days; d++) cells.push(`${ym}-${pad(d)}`);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export const monthLabel = (ym) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", month: "long", year: "numeric" }).format(new Date(`${ym}-01T00:00:00Z`));

export const longDateLabel = (dateStr) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${dateStr}T00:00:00Z`));

export const WEEKDAYS = [
  ["Sun", "Sunday"], ["Mon", "Monday"], ["Tue", "Tuesday"], ["Wed", "Wednesday"], ["Thu", "Thursday"], ["Fri", "Friday"], ["Sat", "Saturday"],
];
