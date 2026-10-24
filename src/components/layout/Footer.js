import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { clinic, telHref, mailHref, whatsappHref, mapsSearchHref } from "@/config/clinic";
import { navLinks } from "@/config/navigation";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="mt-24 bg-cedar-dark text-white">
      <div className="page-width grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" aria-label="CedarCare Family Clinic home"><Logo light /></Link>
          <p className="mt-4 text-sm text-white/80">{clinic.tagline}</p>
          <p className="mt-4 text-xs text-white/65">Demo website. All clinic details and doctors are fictional.</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-base font-sans font-semibold">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            {navLinks.map((l) => (
              <li key={l.href}><Link className="hover:underline" href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-base font-sans font-semibold">Contact</h2>
          <ul className="mt-3 space-y-3 text-sm text-white/85">
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><a className="hover:underline" href={telHref}>{clinic.phone}</a></li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><a className="hover:underline" href={mailHref}>{clinic.email}</a></li>
            <li className="flex gap-2"><MessageCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><a className="hover:underline" href={whatsappHref} target="_blank" rel="noopener noreferrer">Message on WhatsApp</a></li>
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><a className="hover:underline" href={mapsSearchHref} target="_blank" rel="noopener noreferrer">{clinic.address}</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-sans font-semibold">Opening hours</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            {clinic.hoursText.map((h) => (
              <li key={h.days} className="flex gap-2"><Clock size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><span>{h.days}<br />{h.hours}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="page-width flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/70">
          <p>© {new Date().getFullYear()} {clinic.name} (portfolio demo)</p>
          <ul className="flex flex-wrap gap-5">
            <li><Link className="hover:underline" href="/privacy">Privacy policy</Link></li>
            <li><Link className="hover:underline" href="/terms">Terms</Link></li>
            <li><Link className="hover:underline" href="/staff/login">Staff Portal</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
