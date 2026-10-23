"use client";

export default function Error({ reset }) {
  return (
    <div className="page-width py-28">
      <h1 className="text-4xl text-cedar-dark">Something went wrong</h1>
      <p className="mt-4 max-w-md text-lg text-muted">We could not load this page. Please try again, or call the clinic if it keeps happening.</p>
      <button type="button" onClick={reset} className="btn btn-primary mt-8">Try again</button>
    </div>
  );
}
