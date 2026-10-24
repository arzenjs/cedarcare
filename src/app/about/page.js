import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import BookLink from "@/components/ui/BookLink";
import Image from "next/image";
import Avatar from "@/components/ui/Avatar";
import Reveal from "@/components/ui/Reveal";
import { images } from "@/config/images";
import { doctors } from "@/data/doctors";

export const metadata = { title: "About" };

const values = [
  { title: "Listen first", text: "Most of a good diagnosis starts with an unhurried conversation." },
  { title: "Explain plainly", text: "You should leave knowing what was found, what it means and what happens next." },
  { title: "Respect time", text: "Appointments have a set length, and the schedule is honest about it." },
  { title: "Keep it simple", text: "Booking, contact and follow-up should never feel like a chore." },
];

const visit = [
  "Arrive about 10 minutes early and tell the front desk your appointment reference.",
  "Your doctor reviews why you came and anything you have brought, such as reports or medicines.",
  "You are examined where needed, and the doctor explains their findings and options.",
  "Before you leave, you know the next step, including whether a follow-up visit makes sense.",
];

export default function AboutPage() {
  return (
    <>
      <section className="page-width py-16">
        <h1 className="text-5xl text-cedar-dark">About CedarCare</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          CedarCare Family Clinic is a fictional clinic created for a portfolio demonstration. The mission below is how a real neighbourhood clinic of this kind might describe itself.
        </p>
      </section>

      <section className="bg-mist/60 py-16">
        <div className="page-width grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading title="Our mission" />
            <p className="mt-4 text-lg leading-relaxed text-muted">
              To give families in Patna dependable everyday healthcare in a calm setting, with doctors who take the time to understand each patient and a booking process that is as simple as it should be.
            </p>
          </Reveal>
          <Reveal>
            <Image src={images.clinic.src} alt={images.clinic.alt} width={images.clinic.width} height={images.clinic.height} sizes="(min-width: 1024px) 34rem, 100vw" className="aspect-[4/3] w-full rounded-2xl border border-line object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="page-width py-16">
        <SectionHeading title="Our approach to care" intro="We plan visits around the patient, not the other way round. Every doctor sets their own consultation length so there is room for questions." />
        <dl className="mt-10 grid gap-8 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="border-t border-line pt-4">
              <dt className="font-display text-2xl text-cedar-dark">{v.title}</dt>
              <dd className="mt-1 text-muted">{v.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="page-width pb-16">
        <SectionHeading title="What happens during a visit" />
        <ol className="mt-8 max-w-2xl list-decimal space-y-3 pl-6 text-lg text-muted marker:font-semibold marker:text-cedar">
          {visit.map((v) => <li key={v}>{v}</li>)}
        </ol>
      </section>

      <section className="bg-mist/60 py-16">
        <div className="page-width">
          <SectionHeading title="The team" intro="Three fictional doctors, shown as sample content." />
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {doctors.map((d) => (
              <li key={d.id} className="flex items-center gap-4 rounded-lg border border-line bg-white p-5">
                <Avatar doctor={d} size={56} />
                <div>
                  <Link href={`/doctors/${d.id}`} className="font-semibold text-cedar underline underline-offset-4">{d.name}</Link>
                  <p className="text-sm text-muted">{d.specialty}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-width py-16 text-center">
        <h2 className="text-3xl text-cedar-dark">Book your first visit</h2>
        <BookLink className="mt-6 !px-7 !py-3.5">Book an appointment</BookLink>
      </section>
    </>
  );
}
