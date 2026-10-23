import { doctors } from "@/data/doctors";
import DoctorList from "@/components/doctors/DoctorList";

export const metadata = { title: "Our doctors" };

export default function DoctorsPage() {
  return (
    <div className="page-width py-16">
      <h1 className="text-5xl text-cedar-dark">Our doctors</h1>
      <p className="mt-4 mb-8 max-w-2xl text-lg text-muted">
        Profiles are fictional demo content. Choose a doctor to see their schedule and book a visit.
      </p>
      <DoctorList doctors={doctors} />
    </div>
  );
}
