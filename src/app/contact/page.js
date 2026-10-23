import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import { clinic, telHref, mailHref, whatsappHref, mapsSearchHref, mapsDirectionsHref } from "@/config/clinic";
import ContactForm from "@/components/contact/ContactForm";

export const metadata = { title: "Contact and location" };

export default function ContactPage() {
  // Optional interactive map. Without a key the page uses plain Google Maps links.
  const embedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const embedSrc = embedKey ? `https://www.google.com/maps/embed/v1/place?key=${embedKey}&q=${encodeURIComponent(clinic.address)}` : null;
  const links = [
    [Phone, "Call", clinic.phone, telHref],
    [Mail, "Email", clinic.email, mailHref],
    [MessageCircle, "WhatsApp", "Send a message", whatsappHref],
  ];

  return (
    <div className="page-width py-16">
      <h1 className="text-5xl text-cedar-dark">Contact and location</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">To book a visit, use the <a className="font-semibold text-cedar underline" href="/appointments">appointment form</a>. A WhatsApp message does not create a booking.</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <ul className="space-y-4">
            {links.map(([Icon, label, text, href]) => (
              <li key={label}>
                <a href={href} {...(label === "WhatsApp" ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-center gap-4 rounded-lg border border-line bg-white p-4 hover:border-leaf">
                  <Icon size={22} className="text-leaf" aria-hidden="true" />
                  <span><span className="block text-sm text-muted">{label}</span><span className="font-semibold">{text}</span></span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex gap-3">
            <MapPin size={20} className="mt-1 shrink-0 text-leaf" aria-hidden="true" />
            <p>{clinic.address}</p>
          </div>
          <div className="mt-4 flex gap-3">
            <Clock size={20} className="mt-1 shrink-0 text-leaf" aria-hidden="true" />
            <ul>{clinic.hoursText.map((h) => <li key={h.days}>{h.days}: <strong>{h.hours}</strong></li>)}</ul>
          </div>

          {embedSrc ? (
            <iframe title="Map showing CedarCare Family Clinic" src={embedSrc} className="mt-8 h-72 w-full rounded-lg border border-line" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={mapsSearchHref} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">View on Google Maps</a>
            <a href={mapsDirectionsHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Get directions</a>
          </div>
        </div>

        <div>
          <h2 className="text-2xl text-cedar-dark">Send us a message</h2>
          <div className="mt-6"><ContactForm /></div>
        </div>
      </div>
    </div>
  );
}
