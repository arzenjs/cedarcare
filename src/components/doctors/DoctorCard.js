import Link from "next/link";
import Image from "next/image";
import BookLink from "@/components/ui/BookLink";
import { doctorDays } from "@/lib/format";

export default function DoctorCard({ doctor }) {
  return (
    <article className="card-hover group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white">
      <Link href={`/doctors/${doctor.id}`} tabIndex={-1} aria-hidden="true" className="block aspect-[5/4] overflow-hidden bg-mist">
        <Image src={doctor.image} alt="" width={400} height={500} sizes="(min-width: 1024px) 24rem, (min-width: 768px) 50vw, 100vw" className="h-full w-full object-cover object-[50%_25%] transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl text-cedar-dark">{doctor.name}</h3>
        <p className="text-sm font-medium text-leaf">{doctor.specialty}</p>
        <p className="mt-3 text-muted">{doctor.summary}</p>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex gap-2"><dt className="font-semibold">Visit length:</dt><dd>{doctor.slotMinutes} minutes</dd></div>
          <div className="flex gap-2"><dt className="font-semibold">Days:</dt><dd>{doctorDays(doctor)}</dd></div>
        </dl>
        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <BookLink doctorId={doctor.id} className="!py-2">Book</BookLink>
          <Link href={`/doctors/${doctor.id}`} className="btn btn-secondary !py-2">View profile</Link>
        </div>
      </div>
    </article>
  );
}
