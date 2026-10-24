"use client";
import Calendar from "./Calendar";
import { shortDate } from "@/lib/format";

// Quick picks and the calendar share one value and one onChange, so they always agree.
export default function DatePicker({ dates, value, onChange }) {
  const quickPicks = dates.filter((d) => d.open).slice(0, 6);

  if (quickPicks.length === 0) {
    return <p className="rounded-lg border border-line bg-white p-4 text-muted" role="status">This doctor has no open dates in the next 30 days. Please choose another doctor or call the clinic.</p>;
  }

  return (
    <div className="min-w-0">
      <p className="field-label" id="quick-label">Next available</p>
      <div role="group" aria-labelledby="quick-label" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {quickPicks.map((d) => (
          <button
            key={d.date}
            type="button"
            aria-pressed={value === d.date}
            onClick={() => onChange(d.date)}
            className={`min-w-0 truncate rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors ${value === d.date ? "border-cedar bg-cedar text-white" : "border-line bg-white hover:border-leaf hover:bg-mist"}`}
          >
            {shortDate(d.date)}
          </button>
        ))}
      </div>

      <p className="field-label mt-6" id="calendar-label">Or pick any date</p>
      <div role="group" aria-labelledby="calendar-label" className="max-w-md rounded-lg border border-line bg-white p-3 sm:p-4">
        <Calendar dates={dates} value={value} onChange={onChange} />
      </div>
    </div>
  );
}
