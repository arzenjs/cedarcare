"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { EASE } from "@/lib/motion";

// Accessible accordion: real <button>s with aria-expanded, animated panels.
// Several answers can be open at the same time (same behaviour as before).
export default function Faq({ items }) {
  const base = useId();
  const [open, setOpen] = useState(() => new Set());

  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f, i) => {
        const isOpen = open.has(i);
        const buttonId = `${base}-q${i}`;
        const panelId = `${base}-a${i}`;
        return (
          <div key={f.q}>
            <h3 className="font-sans text-lg">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left font-semibold transition-colors hover:text-cedar"
              >
                <span>{f.q}</span>
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors ${isOpen ? "border-cedar bg-cedar text-white" : "border-line bg-white group-hover:border-leaf"}`}
                >
                  <ChevronDown size={18} />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="pb-5 pr-14 leading-relaxed text-muted">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
