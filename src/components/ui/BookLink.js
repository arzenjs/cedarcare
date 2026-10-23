import Link from "next/link";

// Builds /appointments?doctor=...&service=... so booking buttons preselect choices.
export default function BookLink({ doctorId, serviceId, children = "Book an appointment", variant = "primary", className = "" }) {
  const params = new URLSearchParams();
  if (doctorId) params.set("doctor", doctorId);
  if (serviceId) params.set("service", serviceId);
  const query = params.toString();
  return (
    <Link href={`/appointments${query ? `?${query}` : ""}`} className={`btn btn-${variant} ${className}`}>
      {children}
    </Link>
  );
}
