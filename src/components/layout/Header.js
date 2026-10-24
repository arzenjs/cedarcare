"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/config/navigation";
import { EASE } from "@/lib/motion";
import Logo from "@/components/ui/Logo";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  // Close the menu when the page changes (render-time adjustment, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Escape closes the menu and returns focus to the button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <motion.header
      className="reveal sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="page-width flex h-16 items-center justify-between">
        <Link href="/" aria-label="CedarCare Family Clinic home"><Logo /></Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`group relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-cedar ${active ? "text-cedar" : "text-ink"}`}
              >
                {l.label}
                {/* hover underline grows from the left */}
                <span aria-hidden="true" className="absolute inset-x-3 bottom-0.5 h-0.5 origin-left scale-x-0 bg-leaf transition-transform duration-300 group-hover:scale-x-100" />
                {/* active underline slides between links when you navigate */}
                {active && (
                  <motion.span layoutId="nav-active" aria-hidden="true" className="absolute inset-x-3 bottom-0.5 h-0.5 bg-cedar" transition={{ type: "spring", stiffness: 500, damping: 40 }} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/appointments" className="btn btn-primary hidden !py-2 sm:inline-flex">Book an Appointment</Link>
          <button
            ref={buttonRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-md border border-line transition-colors hover:bg-mist lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <ul className="page-width flex flex-col py-2">
              {navLinks.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease: EASE }}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`block rounded-md px-2 py-3 text-base font-medium transition-colors hover:bg-mist ${isActive(l.href) ? "bg-mist text-cedar" : ""}`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li className="py-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 + navLinks.length * 0.04 }}>
                <Link href="/appointments" className="btn btn-primary w-full">Book an Appointment</Link>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
