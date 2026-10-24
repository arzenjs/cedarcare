"use client";
import { useState } from "react";
import DoctorCard from "./DoctorCard";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

// Client component only because of the specialty filter.
export default function DoctorList({ doctors }) {
  const specialties = ["All", ...new Set(doctors.map((d) => d.specialty))];
  const [active, setActive] = useState("All");
  const shown = active === "All" ? doctors : doctors.filter((d) => d.specialty === active);

  return (
    <>
      <div role="group" aria-label="Filter by specialty" className="flex flex-wrap gap-2">
        {specialties.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={active === s}
            onClick={() => setActive(s)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${active === s ? "border-cedar bg-cedar text-white" : "border-line bg-white hover:bg-mist"}`}
          >
            {s}
          </button>
        ))}
      </div>
      {/* key={active} replays the staggered entrance whenever the filter changes */}
      <Stagger key={active} className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((d) => <StaggerItem key={d.id}><DoctorCard doctor={d} /></StaggerItem>)}
      </Stagger>
    </>
  );
}
