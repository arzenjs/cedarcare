import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { clinic, telHref, mapsDirectionsHref } from "@/config/clinic";
import { images } from "@/config/images";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { faqs } from "@/data/faqs";
import DoctorCard from "@/components/doctors/DoctorCard";
import Icon from "@/components/ui/Icon";
import Faq from "@/components/ui/Faq";
import Reveal, { Entrance, Stagger, StaggerItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import BookLink from "@/components/ui/BookLink";

const steps = [
  { title: "Choose a doctor and service", text: "Pick who you would like to see and the reason for your visit." },
  { title: "Select a time that suits you", text: "Choose a date from the calendar and see only the times that are genuinely free." },
  { title: "Enter your contact details", text: "We only ask for what we need to manage the appointment. No account is required." },
  { title: "Receive your confirmation", text: "You get a confirmation page and reference straight away, with an email where available." },
];

const advantages = [
  { title: "Clear scheduling", text: "Each doctor has their own hours and visit length, and the booking form reflects them exactly." },
  { title: "Unhurried visits", text: "Appointment lengths are set by the doctor, so consultations are planned rather than squeezed in." },
  { title: "Straightforward communication", text: "Findings and next steps are explained in plain language, and you can reach the clinic by phone or WhatsApp." },
];

export default function Home() {
  const { hero, clinic: clinicImg } = images;
  return (
    <>
      {/* Hero: text on the left, image on the right; stacks on mobile */}
      <section className="overflow-hidden border-b border-line">
        <div className="page-width grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <Entrance as="p" className="text-base font-medium text-leaf">{clinic.name}, Patna</Entrance>
            <Entrance as="h1" delay={0.08} className="mt-3 text-5xl text-cedar-dark sm:text-6xl">{clinic.tagline}</Entrance>
            <Entrance as="p" delay={0.16} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              A family clinic where you choose your doctor, see real available times, and book in under two minutes, with no account needed.
            </Entrance>
            <Entrance delay={0.24} className="mt-8 flex flex-wrap gap-3">
              <BookLink className="!px-6 !py-3.5">Book an appointment</BookLink>
              <a href={telHref} className="btn btn-secondary !px-6 !py-3.5"><Phone size={18} aria-hidden="true" />Call the clinic</a>
            </Entrance>
            <Entrance delay={0.32} as="p" className="mt-8 flex items-center gap-2 text-sm text-muted">
              <Clock size={16} aria-hidden="true" />Open Monday – Saturday, 9 AM – 7 PM
            </Entrance>
          </div>

          <Entrance delay={0.15} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden="true" className="absolute -right-3 -top-3 h-full w-full rounded-2xl bg-mist lg:-right-5 lg:-top-5" />
            <Image
              src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority
              sizes="(min-width: 1024px) 34rem, (min-width: 448px) 28rem, 100vw"
              className="relative aspect-[4/5] w-full rounded-2xl border border-line object-cover"
            />
            <div className="absolute -bottom-4 left-4 right-4 flex items-center gap-3 rounded-lg border border-line bg-white p-4 shadow-sm sm:right-auto">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-mist text-cedar"><Clock size={18} aria-hidden="true" /></span>
              <p className="text-sm"><span className="block font-semibold">Mon – Sat, 9 AM – 7 PM</span><span className="text-muted">Book online any time</span></p>
            </div>
          </Entrance>
        </div>
      </section>

      {/* Introduction with image */}
      <section className="page-width grid items-center gap-12 py-24 lg:grid-cols-2">
        <Reveal>
          <Image src={clinicImg.src} alt={clinicImg.alt} width={clinicImg.width} height={clinicImg.height} sizes="(min-width: 1024px) 34rem, 100vw" className="aspect-[4/3] w-full rounded-2xl border border-line object-cover" />
        </Reveal>
        <Reveal>
          <SectionHeading title="Family healthcare that respects your time" />
          <p className="mt-5 text-lg leading-relaxed text-muted">
            CedarCare is a small, modern clinic in Patna for everyday and preventive care. Our doctors cover general medicine, child health and skin concerns, and every visit starts with listening.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">Booking is built around you: see which times are open, pick one, and you are done.</p>
          <Link href="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-cedar underline underline-offset-4">About the clinic <ArrowRight size={16} aria-hidden="true" /></Link>
        </Reveal>
      </section>

      {/* Doctors */}
      <section className="bg-mist/60 py-20">
        <div className="page-width">
          <Reveal><SectionHeading title="Meet our doctors" intro="Three specialists, each with their own schedule. All profiles are fictional demo content." /></Reveal>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {doctors.map((d) => <StaggerItem key={d.id}><DoctorCard doctor={d} /></StaggerItem>)}
          </Stagger>
        </div>
      </section>

      {/* Services */}
      <section className="page-width py-20">
        <Reveal><SectionHeading title="Services" intro="Consultations for the whole family. Descriptions are informational and not a promise of any outcome." /></Reveal>
        <Stagger as="ul" className="mt-10 grid gap-x-12 sm:grid-cols-2">
          {services.map((s) => (
            <StaggerItem as="li" key={s.id} className="flex gap-4 border-t border-line py-6">
              <Icon name={s.icon} size={26} className="mt-1 shrink-0 text-leaf" />
              <div>
                <h3 className="text-xl text-cedar-dark">{s.title}</h3>
                <p className="mt-1 text-muted">{s.description}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Link href="/services" className="mt-4 inline-flex items-center gap-2 font-semibold text-cedar underline underline-offset-4">See all services <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>

      {/* Process (a real sequence, so numbered) */}
      <section className="bg-cedar-dark py-20 text-white">
        <div className="page-width">
          <Reveal><h2 className="text-3xl sm:text-4xl">How booking works</h2></Reveal>
          <Stagger as="ol" className="mt-10 grid gap-8 md:grid-cols-4">
            {steps.map((s, i) => (
              <StaggerItem as="li" key={s.title}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold text-cedar-dark">{i + 1}</span>
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Advantages */}
      <section className="page-width py-20">
        <Reveal><SectionHeading title="What to expect" /></Reveal>
        <Stagger as="dl" className="mt-10 grid gap-10 md:grid-cols-3">
          {advantages.map((a) => (
            <StaggerItem key={a.title}>
              <dt className="font-display text-2xl text-cedar-dark">{a.title}</dt>
              <dd className="mt-2 leading-relaxed text-muted">{a.text}</dd>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Hours + location */}
      <section className="page-width grid gap-6 pb-20 md:grid-cols-2">
        <Reveal className="rounded-lg border border-line bg-white p-8">
          <h2 className="flex items-center gap-2 text-2xl text-cedar-dark"><Clock size={22} aria-hidden="true" />Opening hours</h2>
          <ul className="mt-4 space-y-2">
            {clinic.hoursText.map((h) => (
              <li key={h.days} className="flex justify-between gap-4 border-b border-line pb-2"><span>{h.days}</span><span className="font-semibold">{h.hours}</span></li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="rounded-lg border border-line bg-white p-8">
          <h2 className="flex items-center gap-2 text-2xl text-cedar-dark"><MapPin size={22} aria-hidden="true" />Find us</h2>
          <p className="mt-4 text-muted">{clinic.address}</p>
          <a href={mapsDirectionsHref} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-6">Get directions</a>
        </Reveal>
      </section>

      {/* FAQ: full content width, heading on the left, accordion on the right */}
      <section className="page-width grid gap-10 pb-24 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <Reveal>
          <SectionHeading title="Common questions" intro="Quick answers about booking and visiting the clinic." />
          <p className="mt-6 text-muted">Still unsure? <Link href="/contact" className="font-semibold text-cedar underline underline-offset-4">Contact us</Link>.</p>
        </Reveal>
        <Reveal><Faq items={faqs} /></Reveal>
      </section>

      {/* Final CTA */}
      <section className="page-width">
        <Reveal className="rounded-lg bg-cedar px-8 py-14 text-center text-white">
          <h2 className="text-3xl sm:text-4xl">Ready to see a doctor?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/85">Choose a time that works for you. It takes less than two minutes.</p>
          <Link href="/appointments" className="btn mt-8 bg-white !px-7 !py-3.5 text-cedar-dark hover:bg-mist">Book an appointment</Link>
        </Reveal>
      </section>
    </>
  );
}
