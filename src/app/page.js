import Link from "next/link";
import { ArrowRight, Clock, MapPin, ChevronDown, Phone } from "lucide-react";
import { clinic, telHref, mapsDirectionsHref } from "@/config/clinic";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { faqs } from "@/data/faqs";
import { doctorDays } from "@/lib/format";
import DoctorCard from "@/components/doctors/DoctorCard";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import BookLink from "@/components/ui/BookLink";
import Avatar from "@/components/ui/Avatar";

const steps = [
  { title: "Choose a doctor and service", text: "Pick who you would like to see and the reason for your visit." },
  { title: "Select a time that suits you", text: "You only see times that are genuinely free, based on each doctor's real schedule." },
  { title: "Enter your contact details", text: "We only ask for what we need to manage the appointment. No account is required." },
  { title: "Receive your confirmation", text: "You get a confirmation page and reference straight away, with an email where available." },
];

const advantages = [
  { title: "Clear scheduling", text: "Each doctor has their own hours and visit length, and the booking form reflects them exactly." },
  { title: "Unhurried visits", text: "Appointment lengths are set by the doctor, so consultations are planned rather than squeezed in." },
  { title: "Straightforward communication", text: "Findings and next steps are explained in plain language, and you can reach the clinic by phone or WhatsApp." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="page-width grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <p className="text-base font-medium text-leaf">{clinic.name}, Patna</p>
            <h1 className="mt-3 text-5xl text-cedar-dark sm:text-6xl">{clinic.tagline}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              A family clinic where you choose your doctor, see real available times, and book in under two minutes, with no account needed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookLink className="!px-6 !py-3.5">Book an appointment</BookLink>
              <a href={telHref} className="btn btn-secondary !px-6 !py-3.5"><Phone size={18} aria-hidden="true" />Call the clinic</a>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl text-cedar-dark">Who is in this week</h2>
            <ul className="mt-4 divide-y divide-line">
              {doctors.map((d) => (
                <li key={d.id} className="flex items-center gap-4 py-4">
                  <Avatar name={d.name} tone={d.tone} size={48} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-sm text-muted">{d.specialty} · {doctorDays(d)}</p>
                  </div>
                  <Link href={`/appointments?doctor=${d.id}`} className="shrink-0 text-sm font-semibold text-cedar underline underline-offset-4">Book</Link>
                </li>
              ))}
            </ul>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Clock size={15} aria-hidden="true" />Open Monday – Saturday, 9 AM – 7 PM</p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="page-width grid gap-10 py-20 lg:grid-cols-2">
        <SectionHeading title="Family healthcare that respects your time" />
        <Reveal>
          <p className="text-lg leading-relaxed text-muted">
            CedarCare is a small, modern clinic in Patna for everyday and preventive care. Our doctors cover general medicine, child health and skin concerns, and every visit starts with listening.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Booking is built around you: see which times are open, pick one, and you are done.
          </p>
          <Link href="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-cedar underline underline-offset-4">About the clinic <ArrowRight size={16} aria-hidden="true" /></Link>
        </Reveal>
      </section>

      {/* Doctors */}
      <section className="bg-mist/60 py-20">
        <div className="page-width">
          <SectionHeading title="Meet our doctors" intro="Three specialists, each with their own schedule. All profiles are fictional demo content." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {doctors.map((d) => <Reveal key={d.id}><DoctorCard doctor={d} /></Reveal>)}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="page-width py-20">
        <SectionHeading title="Services" intro="Consultations for the whole family. Descriptions are informational and not a promise of any outcome." />
        <ul className="mt-10 grid gap-x-12 sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.id} className="flex gap-4 border-t border-line py-6">
              <Icon name={s.icon} size={26} className="mt-1 shrink-0 text-leaf" />
              <div>
                <h3 className="text-xl text-cedar-dark">{s.title}</h3>
                <p className="mt-1 text-muted">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/services" className="mt-4 inline-flex items-center gap-2 font-semibold text-cedar underline underline-offset-4">See all services <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>

      {/* Process (a real sequence, so numbered) */}
      <section className="bg-cedar-dark py-20 text-white">
        <div className="page-width">
          <h2 className="text-3xl sm:text-4xl">How booking works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold text-cedar-dark">{i + 1}</span>
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Advantages */}
      <section className="page-width py-20">
        <SectionHeading title="What to expect" />
        <dl className="mt-10 grid gap-10 md:grid-cols-3">
          {advantages.map((a) => (
            <div key={a.title}>
              <dt className="font-display text-2xl text-cedar-dark">{a.title}</dt>
              <dd className="mt-2 leading-relaxed text-muted">{a.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Hours + location */}
      <section className="page-width grid gap-6 pb-20 md:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-8">
          <h2 className="flex items-center gap-2 text-2xl text-cedar-dark"><Clock size={22} aria-hidden="true" />Opening hours</h2>
          <ul className="mt-4 space-y-2">
            {clinic.hoursText.map((h) => (
              <li key={h.days} className="flex justify-between gap-4 border-b border-line pb-2"><span>{h.days}</span><span className="font-semibold">{h.hours}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-white p-8">
          <h2 className="flex items-center gap-2 text-2xl text-cedar-dark"><MapPin size={22} aria-hidden="true" />Find us</h2>
          <p className="mt-4 text-muted">{clinic.address}</p>
          <a href={mapsDirectionsHref} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-6">Get directions</a>
        </div>
      </section>

      {/* FAQ: native details/summary is keyboard accessible by default */}
      <section className="page-width max-w-3xl pb-20">
        <SectionHeading title="Common questions" />
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {f.q}
                <ChevronDown aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180" size={20} />
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="page-width">
        <div className="rounded-lg bg-cedar px-8 py-14 text-center text-white">
          <h2 className="text-3xl sm:text-4xl">Ready to see a doctor?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/85">Choose a time that works for you. It takes less than two minutes.</p>
          <Link href="/appointments" className="btn mt-8 bg-white !px-7 !py-3.5 text-cedar-dark hover:bg-mist">Book an appointment</Link>
        </div>
      </section>
    </>
  );
}
