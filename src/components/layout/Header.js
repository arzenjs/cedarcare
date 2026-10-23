"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { clinic } from "@/config/clinic";
import { navLinks } from "@/config/navigation";

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
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="page-width flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl text-cedar-dark" aria-label={`${clinic.name} home`}>
          Cedar<span className="text-leaf">Care</span>
          <span className="ml-2 hidden text-sm font-sans text-muted sm:inline">Family Clinic</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-mist ${isActive(l.href) ? "text-cedar underline underline-offset-8 decoration-2" : "text-ink"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/appointments" className="btn btn-primary hidden !py-2 sm:inline-flex">Book an Appointment</Link>
          <button
            ref={buttonRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-md border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-line bg-paper lg:hidden">
          <ul className="page-width flex flex-col py-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`block rounded-md px-2 py-3 text-base font-medium ${isActive(l.href) ? "bg-mist text-cedar" : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="py-3">
              <Link href="/appointments" className="btn btn-primary w-full">Book an Appointment</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
