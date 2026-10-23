import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-width py-28">
      <h1 className="text-5xl text-cedar-dark">Page not found</h1>
      <p className="mt-4 max-w-md text-lg text-muted">The page you are looking for does not exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn btn-primary">Go to home</Link>
        <Link href="/appointments" className="btn btn-secondary">Book an appointment</Link>
      </div>
    </div>
  );
}
