"use client";
import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays } from "@/lib/scheduling";
import { monthGrid, monthLabel, monthOf, shiftMonth, longDateLabel, WEEKDAYS } from "@/lib/calendar";

/**
 * Month calendar for picking an appointment date.
 * `dates` is the list from /api/availability: [{ date, open }] covering the booking window.
 * That list already reflects the doctor's days, leave, clinic holidays and notice rules,
 * so the calendar can never offer a date the schedule rejects. The server re-checks on booking anyway.
 * Keyboard: arrow keys move between open days, PageUp/PageDown change month.
 */
export default function Calendar({ dates, value, onChange }) {
  const tableRef = useRef(null);
  const byDate = useMemo(() => new Map(dates.map((d) => [d.date, d.open])), [dates]);
  const first = dates[0].date; // today in the clinic time zone (the API starts the list there)
  const last = dates[dates.length - 1].date;

  const [month, setMonth] = useState(monthOf(value || first));
  // When the date changes from outside (quick picks), follow it. Render-time adjustment, no effect.
  const [seenValue, setSeenValue] = useState(value);
  if (value !== seenValue) {
    setSeenValue(value);
    if (value) setMonth(monthOf(value));
  }

  const cells = monthGrid(month);
  const canPrev = month > monthOf(first);
  const canNext = month < monthOf(last);
  // Roving tabindex: one day is the tab stop (the selected day, else the first open day this month).
  const tabStop = value && monthOf(value) === month ? value : cells.find((c) => c && byDate.get(c));

  function goTo(date) {
    setMonth(monthOf(date));
    requestAnimationFrame(() => tableRef.current?.querySelector(`[data-date="${date}"]`)?.focus());
  }

  function onKeyDown(e) {
    const current = e.target.dataset?.date;
    if (!current) return;
    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const target = shiftMonth(month, e.key === "PageUp" ? -1 : 1);
      if (target >= monthOf(first) && target <= monthOf(last)) setMonth(target);
      return;
    }
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step) return;
    e.preventDefault();
    let next = current;
    for (let i = 0; i < 14; i++) {
      next = addDays(next, step);
      if (next < first || next > last) return;
      if (byDate.get(next)) return goTo(next);
    }
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button type="button" onClick={() => setMonth(shiftMonth(month, -1))} disabled={!canPrev} aria-label="Previous month" className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <div className="min-w-0 text-center">
          <h3 className="font-display text-xl text-cedar-dark" aria-live="polite">{monthLabel(month)}</h3>
          {month !== monthOf(first) && (
            <button type="button" onClick={() => setMonth(monthOf(first))} className="text-xs font-semibold text-cedar underline underline-offset-4">Back to current month</button>
          )}
        </div>
        <button type="button" onClick={() => setMonth(shiftMonth(month, 1))} disabled={!canNext} aria-label="Next month" className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <table ref={tableRef} role="grid" aria-label={`Choose a date, ${monthLabel(month)}`} onKeyDown={onKeyDown} className="w-full table-fixed border-separate border-spacing-1">
        <thead>
          <tr>
            {WEEKDAYS.map(([short, long]) => (
              <th key={short} scope="col" abbr={long} className="pb-1 text-center text-xs font-semibold text-muted">{short}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, row) => (
            <tr key={row}>
              {cells.slice(row * 7, row * 7 + 7).map((date, col) => {
                if (!date) return <td key={col} />;
                const open = byDate.get(date) === true; // dates outside the window are not in the map
                const selected = value === date;
                const isToday = date === first;
                return (
                  <td key={date} className="p-0 text-center">
                    <button
                      type="button"
                      data-date={date}
                      disabled={!open}
                      tabIndex={date === tabStop ? 0 : -1}
                      aria-pressed={selected}
                      aria-label={`${longDateLabel(date)}${isToday ? ", today" : ""}${open ? "" : ", unavailable"}`}
                      onClick={() => onChange(date)}
                      className={`h-10 w-full rounded-lg text-sm font-medium transition-colors ${
                        selected ? "bg-cedar text-white"
                        : open ? "border border-line bg-white hover:border-leaf hover:bg-mist"
                        : "cursor-not-allowed text-muted/45"
                      } ${isToday && !selected ? "ring-2 ring-leaf/60" : ""}`}
                    >
                      {Number(date.slice(8))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-cedar" aria-hidden="true" />Selected</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-line bg-white" aria-hidden="true" />Available</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded ring-2 ring-leaf/60" aria-hidden="true" />Today</li>
        <li className="flex items-center gap-1.5"><span className="font-semibold text-muted/45" aria-hidden="true">12</span>Unavailable</li>
      </ul>
    </div>
  );
}
